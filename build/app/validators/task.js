import vine from '@vinejs/vine';
export const createTaskValidator = vine.compile(vine.object({
    title: vine.string().minLength(3),
    description: vine.string().optional(),
    isCompleted: vine.boolean().optional(),
}));
export const updateTaskValidator = vine.compile(vine.object({
    title: vine.string().minLength(3).maxLength(255).optional(),
    description: vine.string().maxLength(1000).optional(),
    completed: vine.boolean().optional(),
}));
export const deleteTasksValidator = vine.compile(vine.object({
    ids: vine.array(vine.number()).minLength(1),
}));
//# sourceMappingURL=task.js.map