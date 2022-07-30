'use strict'
const User = use('App/Models/User')
const Atleta = use('App/Models/Atleta')
const Treinador = use('App/Models/Treinador')
class UserController {
    async verificarEmail({ request, response }) {
        const dados = request.all()
        let usuario = await User.query().where('email', dados.email).first()
        if(usuario){
            return response.status(400).send()
        }else{
            return response.status(200).send()
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

                        u.atleta.peso = parseFloat(u.atleta.peso)
                        u.atleta.altura = parseFloat(u.atleta.altura)

                }
                if(u.treinador){
                    if(u.treinador.equipe){
                        u.status = 'treinador_com_equipe'
                    }else{
                        u.status = 'treinador_sem_equipe'
                    }
                }
                return u ? u : response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
            }
        } catch (error) {
            return response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
        }
    }
    async alterarDadosUsuario({request, response, params}){
        try {
            let dado = request.all()
            let user = await User.query().where('id', params.id).first()
            if(user){
                user.nome = dado.nome
                user.email = dado.email
                user.cpf = dado.cpf
                user.data_nascimento = dado.data_nascimento
                await user.save()
                if(dado.tipo_usuario == 'Atleta'){
                    let atleta = await Atleta.query().where('user_id', user.id).first()
                    if(atleta){
                        atleta.peso = dado.peso
                        atleta.altura = dado.altura
                        await atleta.save()
                        atleta = atleta.toJSON()
                        user.atleta = {...atleta}
                        user.atleta.peso = parseFloat(user.atleta.peso)
                        user.atleta.altura = parseFloat(user.atleta.altura)
                    }
                }else if(dado.tipo_usuario == 'Treinador'){
                    console.log('ola', user.id)
                    let treinador = await Treinador.query().where('user_id', user.id).first()
                    if(treinador){
                        treinador.cref = dado.cref
                        await treinador.save()
                        treinador = treinador.toJSON()
                        user.treinador = {...treinador}
                    }
                }
            }
            return user ? user : response.status(400).send({ error: { message: 'Erro ao atualizar dados do usuario!'} })
        } catch (error) {
            return response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
        }
    }
    async alterarSenha({request, response, params}){
        try {
            let dado = request.all()
            let u = await User.query().where('id', dado.user_id).first()
            if(u){ 
                u.password = dado.password
                await u.save()
            }
            return u ? u : response.status(400).send({ error: { message: 'Erro ao alterar senha do usuário!', e: error.toString() } })
        } catch (error) {
            return response.status(400).send({ error: { message: 'Erro ao buscar os Dados!', e: error.toString() } })
        }
    }
}

module.exports = UserController
