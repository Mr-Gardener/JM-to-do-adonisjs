import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {

    await User.query().delete()

    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: await hash.make('secret'),
        fullName: 'Virk Adonis',
      },
      {
        email: 'romain@adonisjs.com',
        password: await hash.make('supersecret'),
        fullName: 'Romain L.',
      },
    ])
  }
}
