import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator } from '#validators/task'
import Task from '#models/task'
import { updateTaskValidator } from '#validators/task'
import { deleteTasksValidator } from '#validators/task'

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

  async index({ auth, response }: HttpContext) {
    const tasks = await Task.query().where('userId', auth.user!.id).orderBy('createdAt', 'desc')

    return response.ok(tasks)
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

  async destroy({ params, auth, response }: HttpContext) {
    const taskId = params.id

    const task = await Task.find(taskId)

    if (!task) {
      return response.notFound({ message: 'Task not found' })
    }

    // Ensure task belongs to logged-in user
    if (task.userId !== auth.user!.id) {
      return response.forbidden({ message: 'You are not allowed to delete this task' })
    }

    await task.delete()

    return response.ok({ message: 'Task deleted successfully' })
  }

  async deleteMany({ request, auth, response }: HttpContext) {
    const { ids } = await request.validateUsing(deleteTasksValidator)

    //Finds tasks that match AND belong to the user
    const tasks = await Task.query().whereIn('id', ids).andWhere('user_id', auth.user!.id)

    if (tasks.length === 0) {
      return response.notFound({ message: 'No matching tasks found' })
    }

    //Delete only the tasks that belong to the user
    await Task.query().whereIn('id', ids).andWhere('user_id', auth.user!.id).delete()

    return response.ok({
      message: `${tasks.length} task(s) deleted successfully`,
    })
  }
}
