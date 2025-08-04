import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    password: vine.string().minLength(6),
  })
)

/**
 * Validates the forgot Password action
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
