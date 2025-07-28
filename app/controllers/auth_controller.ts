import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Hash from '@adonisjs/core/services/hash'
import { createUserValidator } from '#validators/user'

export default class AuthController {

   async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    const user = await User.create({
      fullName: payload.full_name,
      email: payload.email,
      password: await Hash.make(payload.password),
    })

    return response.status(201).json({
      message: 'User registered successfully',
      user,
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const isValidPassword = await hash.verify(user.password, password)
    if (!isValidPassword) {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token.value,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  }
}