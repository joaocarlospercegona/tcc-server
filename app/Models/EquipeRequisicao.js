'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EquipeRequisicao extends Model {
    static get table () {
        return 'equipe_requisicoes'
    }

    equipe () {
        return this.belongsTo('App/Models/Equipe', 'equipe_id', 'id')
      }
}

module.exports = EquipeRequisicao
