'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SessaoCamposSchema extends Schema {
  up () {
    this.create('sessao_campos', (table) => {
      table.increments()
      table.integer('campo_id').unsigned().index()
      table.foreign('campo_id').references('id').inTable('campos').onDelete('cascade')
      table.integer('sessao_id').unsigned().index()
      table.foreign('sessao_id').references('id').inTable('sessoes').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('sessao_campos')
  }
}

module.exports = SessaoCamposSchema
