'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RolesSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('slug', 100).notNullable().unique().index()
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RolesSchema
