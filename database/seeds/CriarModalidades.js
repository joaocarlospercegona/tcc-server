'use strict'
const Modalidade = use('App/Models/Modalidade')
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
    let modalides = await Modalidade.query().delete()
    let arrayModalidade = [
      {
        nome: 'Arremesso do Peso',
        descricao: ''
      },
      {
        nome: 'Lançamento do Martelo',
        descricao: ''
      },
      {
        nome: 'Lançamento do Disco',
        descricao: ''
      },
      {
        nome: 'Lançamento do Dardo',
        descricao: ''
      },
      {
        nome: '100m rasos',
        descricao: ''
      },
      {
        nome: '100m com barreiras',
        descricao: ''
      },
      {
        nome: '110m com barreiras',
        descricao: ''
      },
      {
        nome: '200m rasos',
        descricao: ''
      },
      {
        nome: '400m rasos',
        descricao: ''
      },
      {
        nome: '400m com barreiras',
        descricao: ''
      },
      {
        nome: '800m rasos',
        descricao: ''
      },
      {
        nome: '1000m rasos',
        descricao: ''
      },
      {
        nome: '1500m rasos',
        descricao: ''
      },
      {
        nome: '3000m rasos',
        descricao: ''
      },
      {
        nome: '3000m com barreiras',
        descricao: ''
      },
      {
        nome: '5000m rasos',
        descricao: ''
      },
      {
        nome: '10000m rasos',
        descricao: ''
      },
      {
        nome: '20000m rasos',
        descricao: ''
      },
      {
        nome: 'Marcha Atlética',
        descricao: ''
      },
      {
        nome: 'Salto em Distância',
        descricao: ''
      },
      {
        nome: 'Salto Triplo',
        descricao: ''
      },
      {
        nome: 'Salto em Altura',
        descricao: ''
      },
      {
        nome: 'Salto com Vara',
        descricao: ''
      },
    ]
    for(let modalidade of arrayModalidade){
      let m = new Modalidade()
      m.nome = modalidade.nome
      m.descricao = modalidade.descricao
      await m.save()
    }
  }
}

module.exports = CriarEquipeSeeder
