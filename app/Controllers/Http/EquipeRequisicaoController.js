'use strict'
const { first } = require("@adonisjs/lucid/src/Lucid/Model")

const Role = use('Role')
const User = use('App/Models/User')
const EquipeRequisicao = use('App/Models/EquipeRequisicao')
const { getStringRandom } = use('App/Helpers')
const Env = use('Env')

class EquipeRequisicaoController {
    async index({ request, response }) {
        const params = request.all()
        let query = EquipeRequisicao.query()
        return await query.fetch()
    }
    async show({ request, response, auth, params }) {
        let dado = params
        let query = EquipeRequisicao.query().where('id', dado.id)
		let requisicao = await query.first()
		return requisicao ? requisicao : response.status(400).send({ error: { message: 'Erro ao mostrar o item solicitado!' } })
    }
    async store({ params, request, response }) {
        try {
            let dado = request.all()
           
            let requisicao = await EquipeRequisicao.create({
                atleta_id: dado.atleta_id,
                equipe_id: dado.equipe_id,
                status: 'Pendente'
            })
            
            return requisicao ? requisicao : response.status(400).send({ error: { message: 'Erro ao criar requisição!' } })
            
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar atleta!', e: error.toString() } })
        }
    }
    async destroy({ request, response, params }) {
        try {
            let requisicao = await EquipeRequisicao.query().where('id', params.id).first()
            if(requisicao){
                await requisicao.delete()
            }
            return requisicao
				? requisicao
				: response.status(400).send({
						error: { message: 'Erro ao deletar a requisição solicitada!' }
				  })
        } catch (error) {
            return response.status(400).send({
				error: {
					message: 'Erro ao deletar a requisição solicitada!',
					e: error.toString()
				}
			})
        }
    }
    async update({ params, request, response, auth }) {
        try {
			let query = EquipeRequisicao.query().where('id', params.id)
			let requisicao = await query.first()
			if (requisicao) {
				let dado = request.all()
				requisicao.merge(dado)
				await requisicao.save()
			}

			return requisicao ? requisicao : response.status(400).send({ error: { message: 'Erro ao atualizar a requisição solicitada!' } })
		} catch (error) {
			return response.status(400).send({ error: { message: 'Erro ao atualizar a requisição solicitada!', e: error.toString() } })
		}
    }
}

module.exports = EquipeRequisicaoController
