import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import scrypt from '@adonisjs/core/services/hash'
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
    password: await scrypt.make(payload.password),
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

  const user = await User.query().where('email', email).first()

  if (!user) {
    console.log('❌ User not found')
    return response.unauthorized({ message: 'Invalid credentials' })
  }

  const isValidPassword = await scrypt.verify(user.password, password)

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