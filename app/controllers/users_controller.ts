import User from '#models/user'
import { forgotPasswordValidator } from '#validators/forgot_password_validator'
import { resetPasswordValidator } from '#validators/reset_password_validator'
import { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

export default class UsersController {
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)
    const user = await User.findBy('email', email)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    // generate a secure random token
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpiresAt = DateTime.utc().plus({ hours: 1 })
    await user.save()

    // 👉 TODO: Send token via email
    console.log(`Password reset token: ${token}`)

    return response.ok({ message: 'Password reset token sent to email' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)
    const user = await User.findBy('resetToken', token)

    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < DateTime.utc()) {
      return response.badRequest({ message: 'Invalid or expired token' })
    }

    user.password = password
    user.resetToken = null
    user.resetTokenExpiresAt = null
    await user.save()

    return response.ok({ message: 'Password has been reset successfully' })
  }
}
