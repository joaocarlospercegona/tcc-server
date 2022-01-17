'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AtletasSchema extends Schema {
  up () {
    this.create('atletas', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('atletas')
  }
}

module.exports = AtletasSchema
