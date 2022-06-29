'use strict'
const { first } = require("@adonisjs/lucid/src/Lucid/Model")

const Role = use('Role')
const User = use('App/Models/User')
const EquipeRequisicao = use('App/Models/EquipeRequisicao')
const Equipe = use('App/Models/Equipe')
const { getStringRandom } = use('App/Helpers')
const Env = use('Env')

class EquipeRequisicaoController {
    async show({ request, response, auth, params }) {
        let dado = params
        let query = EquipeRequisicao.query().where('id', dado.id)
		let requisicao = await query.first()
		return requisicao ? requisicao : response.status(400).send({ error: { message: 'Erro ao mostrar o item solicitado!' } })
    }
    async criarRequisicao({ params, request, response }) {
            let dado = request.all()
            let equipe = await Equipe.query().where('codigo', dado.codigo).first()
            if(equipe){
                let requisicao_existente = await EquipeRequisicao.query().where('atleta_id', dado.atleta).where('equipe_id', equipe.id).first()
                if(requisicao_existente)
                    return response.status(400).send({ error: { message: 'Você já solicitou ingresso nesta Equipe, aguarde o retorno do seu treinador!' } })

                let requisicao = await EquipeRequisicao.create({
                    atleta_id: dado.atleta,
                    equipe_id: equipe.id,
                    status: 'Pendente'
                })
                if(requisicao)
                    return requisicao 
            }else{
                return 'Código de equipe informado inválido!'
            }
            return requisicao ? requisicao : response.status(400).send({ error: { message: 'Erro ao criar requisição!' } })
    }
    async removerAtletaEquipe({ request, response, params }) {
        try {
            let requisicao = await EquipeRequisicao.query().where('atleta_id', params.atleta).where('equipe_id', params.equipe).first()
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
    async alterarStatus({ params, request, response, auth }) {
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
    async buscarRequisicoesPendentes({params, request, response, auth}){
        let query = EquipeRequisicao.query().where('status', 'Pendente').with('atleta').where('equipe_id', params.equipe)
        return await query.fetch()
    }
    async deletarRequisicaoEquipe({request, response, params}){
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
}

module.exports = EquipeRequisicaoController
