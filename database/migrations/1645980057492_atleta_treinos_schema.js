'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtletaTreinosSchema extends Schema {
  up () {
    this.create('atleta_treinos', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('atleta_treinos')
  }
}

module.exports = AtletaTreinosSchema
