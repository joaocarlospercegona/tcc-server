'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EquipeRequisicao extends Model {
    static get table () {
        return 'equipe_requisicoes'
    }
}

module.exports = EquipeRequisicao
