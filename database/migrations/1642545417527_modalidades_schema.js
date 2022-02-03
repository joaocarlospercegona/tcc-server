'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModalidadesSchema extends Schema {
  up () {
    this.create('modalidades', (table) => {
      table.increments()
      table.string('nome')
      table.string('descricao')
      table.timestamps()
    })
  }

  down () {
    this.drop('modalidades')
  }
}

module.exports = ModalidadesSchema
