'use strict'
const Equipe = use('App/Models/Equipe')
const Treinador = use('App/Models/Treinador')
/*
|--------------------------------------------------------------------------
| CriarEquipeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CriarEquipeSeeder {
  async run () {
    let equipe = await Equipe.findBy('nome', 'Equipe Teste')
    if (equipe===null) {
      let treinador = await Treinador.findBy('cref', '123456')
      let equipe = new Equipe()
      equipe.treinador_id = treinador.id
      equipe.nome = 'Equipe Teste'
      equipe.codigo = 'codigo'
      await equipe.save()
    }
  }
}

module.exports = CriarEquipeSeeder
