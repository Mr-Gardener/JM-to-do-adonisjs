import { v } from 'vine'

export const deleteTasksValidator = v.object({
  ids: v.array(v.number()).minLength(1),
})
