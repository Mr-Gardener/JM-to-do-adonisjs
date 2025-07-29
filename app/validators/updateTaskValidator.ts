import vine from '@vinejs/vine'

export const updateTaskValidator = vine.object({
  title: vine.string().minLength(3).maxLength(255).optional(),
  description: vine.string().maxLength(1000).optional(),
  completed: vine.boolean().optional(),
})
