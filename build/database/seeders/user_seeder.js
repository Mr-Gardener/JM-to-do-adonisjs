import { BaseSeeder } from '@adonisjs/lucid/seeders';
import User from '#models/user';
export default class UserSeeder extends BaseSeeder {
    async run() {
        await User.query().delete();
        await User.createMany([
            {
                email: 'virk@adonisjs.com',
                password: 'secret',
                fullName: 'Virk Adonis',
            },
            {
                email: 'romain@adonisjs.com',
                password: 'supersecret',
                fullName: 'Romain L.',
            },
        ]);
    }
}
//# sourceMappingURL=user_seeder.js.map