'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtletasSchema extends Schema {
  up () {
    this.create('atletas', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
      table.decimal('peso', 16,2)
      table.decimal('altura', 16,2)
      table.timestamps()
    })
  }

  down () {
    this.drop('atletas')
  }
}

module.exports = AtletasSchema
