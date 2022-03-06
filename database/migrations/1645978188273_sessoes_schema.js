'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SessoesSchema extends Schema {
  up () {
    this.create('sessoes', (table) => {
      table.increments()
      table.string('nome')
      table.text('descricao')
      table.timestamps()
    })
  }

  down () {
    this.drop('sessoes')
  }
}

module.exports = SessoesSchema
