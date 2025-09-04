import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/create_user_validator'
import { randomUUID } from 'node:crypto'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {
  // register user
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

  // verification mail
  async verifyEmail({ request, response }: HttpContext) {
    const token = request.input('token')

    const user = await User.findBy('verificationToken', token)

    if (!user) {
      return response.badRequest({ message: 'Invalid verification token' })
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    // ✅ Instead of just JSON, redirect to FE login page
    return response.redirect('http://localhost:3000/auth/login')
  }

  // resend verification mail
  async resendVerification({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    if (user.isVerified) {
      return response.badRequest({ message: 'User already verified' })
    }

    // Generate new token
    user.verificationToken = crypto.randomUUID()
    await user.save()

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Verify your email')
        .htmlView('emails/verify', { token: user.verificationToken })
    })

    return response.ok({ message: 'Verification email resent successfully' })
  }

  //login
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Verify credentials
      const user = await User.verifyCredentials(email, password)

      // 🚫 Block if not verified
      if (!user.isVerified) {
        return response.unauthorized({
          message: 'Please verify your email before logging in.',
        })
      }

      // Create token
      const token = await User.accessTokens.create(user)
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

  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.unauthorized({ message: 'Not authenticated' })
      }

      return response.ok({
        user: {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
        },
      })
    } catch (error) {
      return response.internalServerError({ message: 'Failed to fetch user info' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logged out successfully' })
  }
}
