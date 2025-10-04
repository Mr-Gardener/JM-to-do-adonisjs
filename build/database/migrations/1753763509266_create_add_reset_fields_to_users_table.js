import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    async up() {
        this.schema.alterTable('users', (table) => {
            table.string('reset_token').nullable();
            table.timestamp('reset_token_expires_at').nullable();
        });
    }
    async down() {
        this.schema.alterTable('users', (table) => {
            table.dropColumn('reset_token');
            table.dropColumn('reset_token_expires_at');
        });
    }
}
//# sourceMappingURL=1753763509266_create_add_reset_fields_to_users_table.js.map