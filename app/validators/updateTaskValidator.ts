import { v } from 'vine'

export const updateTaskValidator = v.object({
  title: v.string.optional([
    v.rules.minLength(3),
    v.rules.maxLength(255),
  ]),
  description: v.string.optional([
    v.rules.maxLength(1000),
  ]),
  completed: v.boolean.optional(),
})

