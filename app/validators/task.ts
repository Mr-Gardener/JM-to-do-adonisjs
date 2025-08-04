import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3),
    description: vine.string().optional(),
  })
)

/**
 * Validates the tasks update action
 */
export const updateTaskValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).optional(),
    description: vine.string().maxLength(1000).optional(),
    completed: vine.boolean().optional(),
  })
)

/**
 * Validates the delete Tasks action
 */
export const deleteTasksValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()).minLength(1),
  })
)
