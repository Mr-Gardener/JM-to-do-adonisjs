import Task from '#models/task'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class TaskSeeder extends BaseSeeder {
  async run() {
    const john = await User.findBy('email', 'john@example.com')
    const jane = await User.findBy('email', 'jane@example.com')

    if (!john || !jane) {
      console.error('Seed users not found.')
      return
    }

    await Task.createMany([
      {
        title: 'Finish project docs',
        description: 'Complete the documentation by Friday',
        userId: john.id,
      },
      {
        title: 'Fix login bug',
        description: 'Resolve session issues on frontend',
        userId: john.id,
      },
      {
        title: 'Design dashboard',
        description: 'Create new layout for admin dashboard',
        userId: jane.id,
      },
    ])
  }
}
