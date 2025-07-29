import vine from '@vinejs/vine'

export const createTaskValidator = vine.object({
  title: vine.string().minLength(3),
  description: vine.string().optional(),
})
