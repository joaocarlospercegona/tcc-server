'use strict'
const Treinador = use('App/Models/Treinador')
const User = use('App/Models/User')
/*
|--------------------------------------------------------------------------
| CriarTreinadorSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CriarTreinadorSeeder {
  async run () {
    let usuario = await User.findBy('nome', 'Treinador')
    if (usuario===null) {
      let user = await User.create({
        nome: 'Treinador',
        email: 'treinador@gmail.com',
        cpf: '11111111111',
        data_nascimento: '2000-04-18',
        password: '123'
      })
      if(user){
        await Treinador.create(
          {
            user_id: user.id,
            cref: '123456'
          }
        )
      }
    }
  }
}

module.exports = CriarTreinadorSeeder
