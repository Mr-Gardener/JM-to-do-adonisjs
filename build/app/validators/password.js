import vine from '@vinejs/vine';
export const resetPasswordValidator = vine.compile(vine.object({
    token: vine.string(),
    password: vine.string().minLength(6),
}));
export const forgotPasswordValidator = vine.compile(vine.object({
    email: vine.string().email(),
}));
//# sourceMappingURL=password.js.map