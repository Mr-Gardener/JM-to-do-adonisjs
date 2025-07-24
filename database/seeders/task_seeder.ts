import Task from '#models/task'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class TaskSeeder extends BaseSeeder {
  async run() {
    await Task.createMany([
      {
        title: 'Finish project docs',
        description: 'Complete the documentation by Friday',
        userId: 1, 
      },
      {
        title: 'Fix login bug',
        description: 'Resolve session issues on frontend',
        userId: 1,
      },
      {
        title: 'Design dashboard',
        description: 'Create new layout for admin dashboard',
        userId: 2,
      },
    ])
  }
}
