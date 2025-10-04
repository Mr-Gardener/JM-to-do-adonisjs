import { createTaskValidator } from '#validators/task';
import Task from '#models/task';
import { updateTaskValidator } from '#validators/task';
import { deleteTasksValidator } from '#validators/task';
export default class TasksController {
    async store(ctx) {
        const { request, auth, response } = ctx;
        const payload = await request.validateUsing(createTaskValidator);
        const task = await Task.create({
            ...payload,
            userId: auth.user.id,
        });
        return response.created({
            message: 'Task created successfully',
            data: task,
        });
    }
    async index({ auth, response }) {
        const tasks = await Task.query().where('userId', auth.user.id).orderBy('createdAt', 'desc');
        return response.ok(tasks);
    }
    async update(ctx) {
        const { request, auth, params, response } = ctx;
        const payload = await request.validateUsing(updateTaskValidator);
        const taskId = params.id;
        const task = await Task.find(taskId);
        if (!task || task.userId !== auth.user.id) {
            return response.notFound({ message: 'Task not found' });
        }
        task.merge(payload);
        await task.save();
        return response.ok({
            message: 'Task updated successfully',
            data: task,
        });
    }
    async destroy({ params, auth, response }) {
        const taskId = params.id;
        const task = await Task.find(taskId);
        if (!task) {
            return response.notFound({ message: 'Task not found' });
        }
        if (task.userId !== auth.user.id) {
            return response.forbidden({ message: 'You are not allowed to delete this task' });
        }
        await task.delete();
        return response.ok({ message: 'Task deleted successfully' });
    }
    async deleteMany({ request, auth, response }) {
        const { ids } = await request.validateUsing(deleteTasksValidator);
        const tasks = await Task.query().whereIn('id', ids).andWhere('user_id', auth.user.id);
        if (tasks.length === 0) {
            return response.notFound({ message: 'No matching tasks found' });
        }
        await Task.query().whereIn('id', ids).andWhere('user_id', auth.user.id).delete();
        return response.ok({
            message: `${tasks.length} task(s) deleted successfully`,
        });
    }
}
//# sourceMappingURL=tasks_controller.js.map