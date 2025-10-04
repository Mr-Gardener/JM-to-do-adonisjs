import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';
router
    .group(() => {
    router.post('/login', [() => import('#controllers/auth_controller'), 'login']);
    router.post('/register', [() => import('#controllers/auth_controller'), 'register']);
    router.post('/forgot-password', [
        () => import('#controllers/users_controller'),
        'forgotPassword',
    ]);
    router.post('/reset-password', [() => import('#controllers/users_controller'), 'resetPassword']);
    router.get('/verify-email', [() => import('#controllers/auth_controller'), 'verifyEmail']);
    router.post('/resend-verification', [
        () => import('#controllers/auth_controller'),
        'resendVerification',
    ]);
    router
        .get('/me', [() => import('#controllers/auth_controller'), 'me'])
        .middleware([middleware.auth()]);
    router
        .delete('/logout', [() => import('#controllers/auth_controller'), 'logout'])
        .use(middleware.auth({ guards: ['api'] }));
    router
        .group(() => {
        router.post('/', [() => import('#controllers/tasks_controller'), 'store']);
        router.get('/', [() => import('#controllers/tasks_controller'), 'index']);
        router.put('/:id', [() => import('#controllers/tasks_controller'), 'update']);
        router.delete('/bulk-delete', [() => import('#controllers/tasks_controller'), 'deleteMany']);
        router.delete('/:id', [() => import('#controllers/tasks_controller'), 'destroy']);
    })
        .prefix('/tasks')
        .middleware([middleware.auth()]);
})
    .prefix('/api');
//# sourceMappingURL=routes.js.map