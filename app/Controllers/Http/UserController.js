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
            let dado = request.all()
            let u = await User.query().where('email',dado.email).with('treinador.equipe').with('atleta.RequisicaoEquipe.equipe').first()
            if(u){
                u = u.toJSON()
                if(!u.treinador) delete u.treinador
                if(!u.atleta) delete u.atleta
                if(u.atleta){
                if(u.atleta.RequisicaoEquipe && u.atleta.RequisicaoEquipe.status == 'Aceito'){
                    u.status = 'atleta_com_time'
                }else if(u.atleta.RequisicaoEquipe && u.atleta.RequisicaoEquipe.status == 'Pendente'){
                    u.status = 'atleta_com_time_pendente'
                }else{
                    u.status = 'atleta_sem_time'
                }
                if(u.status == 'atleta_com_time')
                    u.atleta.equipe = u.atleta.RequisicaoEquipe.equipe

                if(u.atleta.RequisicaoEquipe)
                    delete u.atleta.RequisicaoEquipe
                }
                if(u.treinador){
                    if(u.treinador.equipe){
                        u.status = 'treinador_com_equipe'
                    }else{
                        u.status = 'treinador_sem_equipe'
                    }
                }
                console.log('u', u)
                return u ? u : response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
            }
        } catch (error) {
            return response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
        }
    }
}

module.exports = UserController
