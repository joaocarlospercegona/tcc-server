'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TreinadoresSchema extends Schema {
  up () {
    this.create('treinadores', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('treinadores')
  }
}

module.exports = TreinadoresSchema
