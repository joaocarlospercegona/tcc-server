'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TreinadoresSchema extends Schema {
  up () {
    this.create('treinadores', (table) => {
      table.increments()
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
      table.string('cref')
      table.timestamps()
    })
  }

  down () {
    this.drop('treinadores')
  }
}

module.exports = TreinadoresSchema
