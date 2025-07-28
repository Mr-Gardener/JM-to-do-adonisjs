import AuthController from '#controllers/auth_controller'
import TasksController from '#controllers/tasks_controller'
import router from '@adonisjs/core/services/router'
import auth from '#middleware/auth_middleware'


router.post('/register', [AuthController, 'register']),
router.post('/login', [AuthController, 'login']),
router.post('/tasks', [TasksController, 'store']).use(auth),
router.get('/tasks', [TasksController, 'index'])
router.get('/', async () => {
  return 'Welcome'
})