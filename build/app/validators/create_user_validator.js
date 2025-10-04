import vine from '@vinejs/vine';
export const createUserValidator = vine.compile(vine.object({
    full_name: vine.string().minLength(3),
    email: vine.string().email(),
    password: vine.string().minLength(6),
}));
//# sourceMappingURL=create_user_validator.js.map