import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: await Hash.make('password'),
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: await Hash.make('password'),
      },
    ])
  }
}
