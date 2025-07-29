import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.alterTable('users', (table) => {
      table.string('reset_token').nullable()
      table.timestamp('reset_token_expires_at').nullable()
    })
  }

  public async down () {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('reset_token')
      table.dropColumn('reset_token_expires_at')
    })
  }
}
