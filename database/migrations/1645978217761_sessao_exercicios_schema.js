'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SessaoCamposSchema extends Schema {
  up () {
    this.create('sessao_exercicios', (table) => {
      table.increments()
      table.string('exercicio_nome')
      table.integer('sessao_id').unsigned().index()
      table.foreign('sessao_id').references('id').inTable('sessoes').onDelete('cascade')
      table.integer('ordem')
      table.text('descricao')
      table.timestamps()
    })
  }

  down () {
    this.drop('sessao_campos')
  }
}

module.exports = SessaoCamposSchema
