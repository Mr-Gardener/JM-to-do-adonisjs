import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.object({
  token: vine.string(),
  password: vine.string().minLength(6),
})

