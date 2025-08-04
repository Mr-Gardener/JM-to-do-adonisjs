import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import TasksController from '#controllers/tasks_controller'
import UsersController from '#controllers/users_controller'
import { middleware } from './kernel.js'

router
  .group(() => {
    //  Public API routes
    router.post('/register', async (ctx) => {
      return new AuthController().register(ctx)
    })
    router.post('/login', [AuthController, 'login'])
    router.post('/forgot-password', [UsersController, 'forgotPassword'])
    router.post('/reset-password', [UsersController, 'resetPassword'])

    // Protected /tasks routes (nested group with auth middleware)
    router
      .group(() => {
        router.post('/', [TasksController, 'store'])
        router.get('/', [TasksController, 'index'])
        router.put('/:id', [TasksController, 'update'])
        router.delete('/:id', [TasksController, 'destroy'])
        router.delete('/', [TasksController, 'deleteMany'])
      })
      .prefix('/tasks')
      .middleware([middleware.auth()])
  })
  .prefix('/api')
