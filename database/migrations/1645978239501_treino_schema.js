'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TreinoSchema extends Schema {
  up () {
    this.create('treinos', (table) => {
      table.increments()
      table.timestamp('data_treino')
      table.timestamps()
    })
  }

  down () {
    this.drop('treinos')
  }
}

module.exports = TreinoSchema
