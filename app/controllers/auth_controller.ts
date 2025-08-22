import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/create_user_validator'
import { randomUUID } from 'node:crypto'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    // Check if user with email already exists
    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.status(409).json({
        message: ' Email already in use',
      })
    }

    // If not, create new user
    const verificationToken = randomUUID()
    const user = await User.create({
      fullName: payload.full_name,
      email: payload.email,
      password: payload.password,
      verificationToken,
      isVerified: false,
    })

    // const token = await User.accessTokens.create(user)

    // Send verification email
    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Verify your account')
        .htmlView('emails/verify', {
          token: verificationToken,
          user: user,
          url: `http://localhost:3333/verify/${verificationToken}`,
        })
    })

    return response.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    })
  }

  async verifyEmail({ request, response }: HttpContext) {
    const token = request.input('token')

    const user = await User.findBy('verification_token', token)

    if (!user) {
      return response.badRequest({ message: 'Invalid verification token' })
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    return response.ok({ message: 'Email verified successfully. You can now log in.' })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // ✅ Verify credentials
      const user = await User.verifyCredentials(email, password)

      // ✅ Create token
      const token = await User.accessTokens.create(user)

      // extract raw token string from the Secret wrapper
      const rawToken = token.value!.release()

      return response.ok({
        access_token: rawToken,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.email,
        },
      })
    } catch (error) {
      console.log('Login error:', error.message)
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }
}
