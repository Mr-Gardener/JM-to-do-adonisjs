import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator } from '#validators/task'
import Task from '#models/task'

export default class TasksController {
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const payload = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      ...payload,
      userId: user.id,
    })

    return response.created({
      message: 'Task created successfully',
      data: task,
    })
  }
}
