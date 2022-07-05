'use strict'
const User = use('App/Models/User')
const Atleta = use('App/Models/Atleta')
const Treinador = use('App/Models/Treinador')
class UserController {
    async verificarEmail({ request, response }) {
        const dados = request.all()
        let usuario = await User.query().where('email', dados.email).first()
        if(usuario){
            return response.status(400)
        }else{
            return response.status(200)
        }
    } 

    async verficarDadosUsuario({request, response}) {
        try {
            let u = await User.query().where('email',email).with('treinador.equipe').with('atleta.RequisicaoEquipe.equipe').first()
            if(u){
                
            }
        } catch (error) {
            return response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
        }
    }
}

module.exports = UserController
