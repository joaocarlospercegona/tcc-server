'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Equipe extends Model {
    static get table () {
        return 'equipes'
    }

    treinador () {
        return this.belongsTo('App/Models/Treinador')
    }

    atletas_aprovados () {
        return this.hasMany('App/Models/EquipeRequisicao')
    }

}

module.exports = Equipe
