import { v } from 'vine'

export const createTaskValidator = v.object({
  title: v.string().minLength(3),
  description: v.string().optional(),
})
