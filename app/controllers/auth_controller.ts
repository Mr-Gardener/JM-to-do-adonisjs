import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'

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
    const user = await User.create({
      fullName: payload.full_name,
      email: payload.email,
      password: payload.password,
    })

    const token = await User.accessTokens.create(user)

    return response.status(201).json({
      token,
      message: 'User registered successfully',
      user,
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      const token = await User.accessTokens.create(user)

      return response.ok({
        token: token.value,
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
