'use strict'

const { first } = require("@adonisjs/lucid/src/Lucid/Model")

const Role = use('Role')
const User = use('App/Models/User')
const Atleta = use('App/Models/Atleta')
const { getStringRandom } = use('App/Helpers')
const Env = use('Env')

class AtletaController {
    async index({ request, response }) {
        const params = request.all()
        let query = Atleta.query()
        return await query.fetch()
    }
    async show({ request, response, auth, params }) {
        let dado = params
        let query = Atleta.query().where('id', dado.id)
		let atleta = await query.first()
		return atleta ? atleta : response.status(400).send({ error: { message: 'Erro ao mostrar o item solicitado!' } })
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
                let atleta = await Atleta.create({
                    user_id: user.id,
                    peso: dado.peso,
                    altura: dado.altura
                })
                return atleta ? atleta : response.status(400).send({ error: { message: 'Erro ao criar atleta!' } })
            }
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar atleta!', e: error.toString() } })
        }
    }
    async destroy({ request, response, params }) {
        try {
            let atleta = await Atleta.query().where('id', params.id).first()
            if(atleta){
                await atleta.delete()
            }
            return atleta
				? atleta
				: response.status(400).send({
						error: { message: 'Erro ao deletar o atleta solicitado!' }
				  })
        } catch (error) {
            return response.status(400).send({
				error: {
					message: 'Erro ao deletar o atleta solicitado!',
					e: error.toString()
				}
			})
        }
    }
    async update({ params, request, response, auth }) {
        try {
			let query = Atleta.query().where('id', params.id)
			let atleta = await query.first()
			if (atleta) {
				let dado = request.input(['peso', 'altura'])
				atleta.merge(dado)
				await atleta.save()
			}
			let user = await User.query().where('id', atleta.user_id).first()
			if (user) {
				let dadin = request.except(['peso', 'altura'])
				user.nome = dadin.nome
				user.email = dadin.email
				user.cpf = dadin.cpf
				user.data_nascimento = dadin.data_nascimento
				await user.save()
			}

			return atleta ? atleta : response.status(400).send({ error: { message: 'Erro ao atualizar o atleta solicitado!' } })
		} catch (error) {
			return response.status(400).send({ error: { message: 'Erro ao atualizar o atleta solicitado!', e: error.toString() } })
		}
    }
}

module.exports = AtletaController
