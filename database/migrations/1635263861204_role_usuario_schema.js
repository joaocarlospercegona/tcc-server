'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleUsuarioSchema extends Schema {
  up () {
    this.create('role_user', (table) => {
      table.increments()
      table.integer('role_id').notNullable().unsigned().index()
      table.foreign('role_id').references('id').inTable('roles').onDelete('cascade')
      table.integer('user_id').notNullable().unsigned().index()
      table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('role_user')
  }
}

module.exports = RoleUsuarioSchema
