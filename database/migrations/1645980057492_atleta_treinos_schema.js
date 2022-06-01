'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtletaTreinosSchema extends Schema {
  up () {
    this.create('atleta_treinos', (table) => {
      table.increments()
      table.integer('treino_id').unsigned().index()
      table.foreign('treino_id').references('id').inTable('treinos').onDelete('cascade')
      table.integer('atleta_id').unsigned().index()
      table.foreign('atleta_id').references('id').inTable('atletas').onDelete('cascade')
      table.boolean('treino_feito').default(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('atleta_treinos')
  }
}

module.exports = AtletaTreinosSchema
