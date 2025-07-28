import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator } from '#validators/task'
import Task from '#models/task'
import { updateTaskValidator } from '#validators/updateTaskValidator'

export default class TasksController {
  async store(ctx: HttpContext) {
    const { request, auth, response } = ctx

    const payload = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created({
      message: 'Task created successfully',
      data: task,
    })
  }

  async index(ctx: HttpContext) {
    const { auth, response } = ctx

    const tasks = await Task.query().where('userId', auth.user!.id).orderBy('createdAt', 'desc')

    return response.ok({
      message: 'Tasks fetched successfully',
      data: tasks,
    })
  }

  async update(ctx: HttpContext) {
    const { request, auth, params, response } = ctx

    const payload = await request.validateUsing(updateTaskValidator)
    const taskId = params.id

    const task = await Task.find(taskId)
    if (!task || task.userId !== auth.user!.id) {
      return response.notFound({ message: 'Task not found' })
    }

    task.merge(payload)
    await task.save()

    return response.ok({
      message: 'Task updated successfully',
      data: task,
    })
  }
}
