import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    router.post('/login', [() => import('#controllers/auth_controller'), 'login'])
    router.post('/register', [() => import('#controllers/auth_controller'), 'register'])
    router.post('/forgot-password', [
      () => import('#controllers/users_controller'),
      'forgotPassword',
    ])
    router.post('/reset-password', [() => import('#controllers/users_controller'), 'resetPassword'])
    router.get('/verify-email', [() => import('#controllers/auth_controller'), 'verifyEmail'])

    router
      .group(() => {
        router.post('/', [() => import('#controllers/tasks_controller'), 'store'])
        router.get('/', [() => import('#controllers/tasks_controller'), 'index'])
        router.put('/:id', [() => import('#controllers/tasks_controller'), 'update'])
        router.delete('/:id', [() => import('#controllers/tasks_controller'), 'destroy'])
        router.delete('/', [() => import('#controllers/tasks_controller'), 'deleteMany'])
      })
      .prefix('/tasks')
      .middleware([middleware.auth()])
  })
  .prefix('/api')
