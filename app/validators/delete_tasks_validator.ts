import vine from '@vinejs/vine'

export const deleteTasksValidator = vine.object({
  ids: vine.array(vine.number()).minLength(1),
})
