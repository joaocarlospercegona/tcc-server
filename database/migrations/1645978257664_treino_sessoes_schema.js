'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TreinoSessoesSchema extends Schema {
  up () {
    this.create('treino_sessoes', (table) => {
      table.increments()
      table.integer('treino_id').unsigned().index()
      table.foreign('treino_id').references('id').inTable('treinos').onDelete('cascade')
      table.integer('sessao_id').unsigned().index()
      table.foreign('sessao_id').references('id').inTable('sessoes').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('treino_sessoes')
  }
}

module.exports = TreinoSessoesSchema
