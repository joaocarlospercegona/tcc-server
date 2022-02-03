'use strict'
const { first } = require("@adonisjs/lucid/src/Lucid/Model")

const Role = use('Role')
const User = use('App/Models/User')
const Treinador = use('App/Models/Treinador')
const { getStringRandom } = use('App/Helpers')
const Env = use('Env')
class TreinadorController {
    async index({ request, response }) {
        const params = request.all()
        let query = Treinador.query()
        return await query.fetch()
    }
    async show({ request, response, auth, params }) {
        let dado = params
        let query = Treinador.query().where('id', dado.id)
		let treinador = await query.first()
		return treinador ? treinador : response.status(400).send({ error: { message: 'Erro ao mostrar o treinador solicitado!' } })
    }
    async store({ params, request, response }) {
        try {
            let dado = request.all()
            let senhaUsuario = dado.password ? dado.password : await getStringRandom(10)
            let user = await User.create({
                nome: dado.nome,
                email: dado.email,
                cpf: dado.cpf,
                data_nascimento: dado.nascimento,
                password: dado.senha
            })
            if(user){
                let treinador = await Treinador.create({
                    user_id: user.id,
                    cref: dado.cref,
                })
                return treinador ? treinador : response.status(400).send({ error: { message: 'Erro ao criar o treinador!' } })
            }
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar o treinador!', e: error.toString() } })
        }
    }
    async destroy({ request, response, params }) {
        try {
            let treinador = await Treinador.query().where('id', params.id).first()
            if(treinador){
                await treinador.delete()
            }
            return treinador
				? treinador
				: response.status(400).send({
						error: { message: 'Erro ao deletar o treinador solicitado!' }
				  })
        } catch (error) {
            return response.status(400).send({
				error: {
					message: 'Erro ao deletar o treinador solicitado!',
					e: error.toString()
				}
			})
        }
    }
    async update({ params, request, response, auth }) {
        try {
			let query = Treinador.query().where('id', params.id)
			let treinador = await query.first()
			if (treinador) {
				let dado = request.input(['cref'])
				treinador.merge(dado)
				await treinador.save()
			}
			let user = await User.query().where('id', treinador.user_id).first()
			if (user) {
				let dadin = request.except(['cref'])
				user.nome = dadin.nome
				user.email = dadin.email
				user.cpf = dadin.cpf
				user.data_nascimento = dadin.data_nascimento
				await user.save()
			}

			return treinador ? treinador : response.status(400).send({ error: { message: 'Erro ao atualizar o treinador solicitado!' } })
		} catch (error) {
			return response.status(400).send({ error: { message: 'Erro ao atualizar o treinador solicitado!', e: error.toString() } })
		}
    }
}

module.exports = TreinadorController
