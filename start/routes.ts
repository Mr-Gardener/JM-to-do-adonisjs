import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'
import TasksController from '#controllers/tasks_controller'
import UsersController from '#controllers/users_controller'
import { middleware } from './kernel.js'
import User from '#models/user'

router.get('/test-db', async () => {
  const users = await User.all()
  return users
})

// 🔓 Public API Routes (no shield middleware)
router.group(() => {
  router.post('/register', async (ctx) => {
    return new AuthController().register(ctx)
  })

  router.post('/login', [AuthController, 'login'])
  router.post('/forgot-password', [UsersController, 'forgotPassword'])
  router.post('/reset-password', [UsersController, 'resetPassword'])
}).prefix('/api') // Optional: prefix all with /api
.middleware([])    // 🛡 No shield

// 🔐 Protected API Routes (with auth middleware)
router.group(() => {
  router.post('/tasks', [TasksController, 'store'])
  router.get('/tasks', [TasksController, 'index'])
  router.put('/tasks/:id', [TasksController, 'update'])
  router.delete('/tasks/:id', [TasksController, 'destroy'])
  router.delete('/tasks', [TasksController, 'deleteMany'])
}).prefix('/api') // Optional: keep consistent
.middleware([middleware.auth()]) // 🔒 Auth only

// 🌐 Web Routes (shield applied)
router.group(() => {
  router.get('/', async () => {
    return 'Welcome'
  })

  router.get('/dashboard', async () => {
    return 'Dashboard Page'
  })
}).middleware([
  () => import('@adonisjs/shield/shield_middleware'),
])
