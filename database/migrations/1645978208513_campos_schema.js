'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CamposSchema extends Schema {
  up () {
    this.create('campos', (table) => {
      table.increments()
      table.string('nome')
      table.timestamps()
    })
  }

  down () {
    this.drop('campos')
  }
}

module.exports = CamposSchema
