'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipeRequisicoesSchema extends Schema {
  up () {
    this.create('equipe_requisicoes', (table) => {
      table.increments()
      table.integer('atleta_id').unsigned().index()
      table.foreign('atleta_id').references('id').inTable('atletas').onDelete('cascade')
      table.integer('equipe_id').unsigned().index()
      table.foreign('equipe_id').references('id').inTable('equipes').onDelete('cascade')
      table.string('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('equipe_requisicoes')
  }
}

module.exports = EquipeRequisicoesSchema
