export default class AuthMiddleware {
    async handle(ctx, next, options = {}) {
        const redirectTo = '/login';
        await ctx.auth.authenticateUsing(options.guards, {
            loginRoute: redirectTo,
        });
        await next();
    }
}
//# sourceMappingURL=auth_middleware.js.map