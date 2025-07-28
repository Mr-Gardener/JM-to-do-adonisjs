import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.query().delete() 

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

