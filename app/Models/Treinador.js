'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Treinador extends Model {

    static get table () {
        return 'treinadores'
    }

    equipe () {
        return this.belongsTo('App/Models/Equipe', 'id', 'treinador_id')
      }
}

module.exports = Treinador
