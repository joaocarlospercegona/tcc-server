'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model")

const Role = use('Role')
const User = use('App/Models/User')
const Equipe = use('App/Models/Equipe')
const EquipeRequisicao = use('App/Models/EquipeRequisicao')
const { getStringRandom } = use('App/Helpers')
const Env = use('Env')

class EquipeController {
    async index({ request, response }) {
        const params = request.all()
        let query = Equipe.query()
        return await query.fetch()
    }
    async show({ request, response, auth, params }) {
        try {
            let dado = params
            let query = Equipe.query().where('id', dado.id).with('atletas_aprovados', (builder) => {
                builder.where('status', 'Aceito')
            }).with('atletas_aprovados.atleta')
            let equipe = await query.first()
            return equipe ? equipe : response.status(400).send({ error: { message: 'Erro ao mostrar o item solicitado!' } })
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar a equipe!', e: error.toString() } })
        }
    }
    async store({ params, request, response }) {
        try {
            let dado = request.all()
            let codin = ''
            for(let c = 0; c < 7; c++){
                let value = Math.floor(Math.random() * 10)
                codin += value
            }
            let equipe = await Equipe.create({
                nome: dado.nome,
                treinador_id: dado.treinador_id,
                codigo: codin
            })
            if(equipe){
                equipe = await Equipe.query().where('id', equipe.id).with('treinador').first()
                
                return equipe ? equipe : response.status(400).send({ error: { message: 'Erro ao criar a equipe!' } })
            }
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar a equipe!', e: error.toString() } })
        }
    }
    async destroy({ request, response, params }) {
        try {
            let equipe = await Equipe.query().where('id', params.id).first()
            if(equipe){
                await equipe.delete()
            }
            return equipe
				? equipe
				: response.status(400).send({
						error: { message: 'Erro ao deletar a equipe solicitado!' }
				  })
        } catch (error) {
            return response.status(400).send({
				error: {
					message: 'Erro ao deletar a equipe solicitado!',
					e: error.toString()
				}
			})
        }
    }
    async alterarDadosEquipe({ params, request, response, auth }) {
        try {
			let query = Equipe.query().where('id', params.id)
			let equipe = await query.first()
			if (equipe) {
				let dado = request.all()
				equipe.merge(dado)
				await equipe.save()
			}
			
			return equipe ? equipe : response.status(400).send({ error: { message: 'Erro ao atualizar a equipe solicitado!' } })
		} catch (error) {
			return response.status(400).send({ error: { message: 'Erro ao atualizar a equipe solicitado!', e: error.toString() } })
		}
    }
    async buscarAtletas({params, request, response, auth}){
        let requisicoes = (await EquipeRequisicao.query().with('atleta.user').where('status','Aceito').where('equipe_id', params.equipe).fetch()).rows
        let retorno = []
        if(requisicoes){
            for(let req of requisicoes){
                req = req.toJSON()
                let obj = {
                    nome: req.atleta.user.nome,
                    id: req.atleta.id
                }
                delete req.atleta
                req.atleta = obj
                retorno.push(req)
            }
        }
        return retorno
    }
}

module.exports = EquipeController
