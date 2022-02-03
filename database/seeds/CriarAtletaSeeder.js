'use strict'
const Atleta = use('App/Models/Atleta')
const User = use('App/Models/User')
/*
|--------------------------------------------------------------------------
| CriarAtletaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CriarAtletaSeeder {
  async run () {
    let usuario = await User.findBy('nome', 'Atleta')
    if (usuario===null) {
      let user = await User.create({
        nome: 'Atleta',
        email: 'atleta@gmail.com',
        cpf: '22222222222',
        data_nascimento: '2000-04-18',
        password: '123'
      })
      if(user){
        let atleta = new Atleta()
        atleta.user_id = user.id
        atleta.peso = 100.5
        atleta.altura = 1.75
        await atleta.save()
      }
    }
  }
}

module.exports = CriarAtletaSeeder
