'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EquipesSchema extends Schema {
  up () {
    this.create('equipes', (table) => {
      table.increments()
      table.string('nome')
      table.integer('treinador_id').unsigned().index()
      table.foreign('treinador_id').references('id').inTable('treinadores').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('equipes')
  }
}

module.exports = EquipesSchema
