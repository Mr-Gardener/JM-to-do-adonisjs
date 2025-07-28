import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator } from '#validators/task'
import Task from '#models/task'

export default class TasksController {
  async store({ request, auth, response }: HttpContext ) {
    const payload = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created({ message: 'Task created successfully', task })
  }
}