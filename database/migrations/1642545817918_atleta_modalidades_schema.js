'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtletaModalidadesSchema extends Schema {
  up () {
    this.create('atleta_modalidades', (table) => {
      table.increments()
      table.integer('atleta_id').unsigned().index()
      table.foreign('atleta_id').references('id').inTable('atletas').onDelete('cascade')
      table.integer('modalide_id').unsigned().index()
      table.foreign('modalide_id').references('id').inTable('modalidades').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('atleta_modalidades')
  }
}

module.exports = AtletaModalidadesSchema
