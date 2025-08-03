import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator } from '#validators/task'
import Task from '#models/task'
import { updateTaskValidator } from '#validators/updateTaskValidator'
import { deleteTasksValidator } from '#validators/delete_tasks_validator'

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

    async destroy({ params, response }: HttpContext) {
    const taskId = params.id

    const task = await Task.find(taskId)

    if (!task) {
      return response.notFound({ message: 'Task not found' })
    }

    await task.delete()

    return response.ok({ message: 'Task deleted successfully' })
  }

    async deleteMany({ request, response }: HttpContext) {
      const { ids } = await request.validateUsing(deleteTasksValidator)

      const tasks = await Task.query().whereIn('id', ids)

      if (tasks.length === 0) {
        return response.notFound({ message: 'No matching tasks found' })
      }

      await Task.query().whereIn('id', ids).delete()

      return response.ok({
        message: `${tasks.length} task(s) deleted successfully`,
      })
    }

}