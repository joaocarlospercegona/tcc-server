'use strict'
const Role = use('Role')
/*
|--------------------------------------------------------------------------
| CriarRoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CriarRoleSeeder {
  async run () {
    if (await Role.findBy('slug', 'treinador')===null) {
      let a = new Role()
      a.name = 'Treinador'
      a.slug = 'treinador'
      await a.save()
    }
    if (await Role.findBy('slug', 'atleta')===null) {
      let a = new Role()
      a.name = 'Atleta'
      a.slug = 'atleta'
      await a.save()
    }
  }
}

module.exports = CriarRoleSeeder
