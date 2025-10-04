import Task from '#models/task';
import User from '#models/user';
import { BaseSeeder } from '@adonisjs/lucid/seeders';
export default class TaskSeeder extends BaseSeeder {
    async run() {
        const virk = await User.findBy('email', 'virk@adonisjs.com');
        const romain = await User.findBy('email', 'romain@adonisjs.com');
        if (!virk || !romain) {
            console.error('Seed users not found.');
            return;
        }
        await Task.createMany([
            {
                title: 'Finish project docs',
                description: 'Complete the documentation by Friday',
                userId: virk.id,
            },
            {
                title: 'Fix login bug',
                description: 'Resolve session issues on frontend',
                userId: virk.id,
            },
            {
                title: 'Design dashboard',
                description: 'Create new layout for admin dashboard',
                userId: romain.id,
            },
        ]);
    }
}
//# sourceMappingURL=task_seeder.js.map