import vine from '@vinejs/vine'

export const forgotPasswordValidator = vine.object({
  email: vine.string().email(),
})
