'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Atleta extends Model {
    user() {
		return this.belongsTo('App/Models/User')
	}

	RequisicaoEquipe () {
        return this.belongsTo('App/Models/EquipeRequisicao', 'id', 'atleta_id')
      }
}

module.exports = Atleta
