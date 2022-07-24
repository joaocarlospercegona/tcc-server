'use strict'
const Env = use('Env')
const Usuario = use('App/Models/User')
const Token = use('App/Models/Token')
const Role = use('Role')
const Atleta = use('App/Models/Atleta')
const Treinador = use('App/Models/Treinador')
const { getStringRandom } = use('App/Helpers')
class AuthController {
      async login({ request, response, auth }) {
        const { email, password } = request.all()
        let u = await Usuario.query().where('email',email).with('treinador.equipe').with('atleta.RequisicaoEquipe.equipe').first()
        if (!u) return response.status(400).send({error: {message: 'Login errado!'}})
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
           // delete u.treinador.equipe
          }else{
            u.status = 'treinador_sem_equipe'
          }
        }
        let rs = {usuario:u}
       
        try {
          rs.login = await auth.withRefreshToken().attempt(email,password)
        }
        catch(e){
          return response.status(400).send({error: {message: 'Senha errada!'+ e}})
        }
        return response.status(200).send(rs)
      }
    
      async refresh({ request, response, auth }) {
        const refresh_token = request.input('refresh_token')
        if (!refresh_token) refresh_token = request.header('refresh_token')
        const data = await auth.newRefreshToken().generateForRefreshToken(refresh_token)
        return response.send(data)
      }
    
      async logout({ request, response, auth }) {
        try {
          let fcm_token = request.input('fcm_token')
          if (fcm_token) await Device.query().where('token', fcm_token).delete()
        } catch (e) {}
        try {
          let refresh_token = request.input('refresh_token')
          if (!refresh_token) refresh_token = request.header('refresh_token')
          await auth.authenticator('jwt').revokeTokens([refresh_token], true)
          return response.status(200).send({})
        }
        catch (error) {
          return response.status(400).send({error: {message: 'Não foi possivel efetuar o logout!', e: error.toString()}})
        }
      }
    
      async remember({ request, response }) {
        try {
          const reset = await PasswordReset.query().where('token', request.input('token')).where('expires_at', '>=', new Date()).firstOrFail()
          return response.status(200).send(reset)
        }
        catch (error) {
          return response.status(400).send({error: {message: 'Não foi possivel encontrar o token!', e: error.toString()}})
        }
      }
    
      async forgot({ request, response }) {
        try {
          const usuario = await Usuario.query().where('email', request.input('email')).first()
          if (usuario) {
            await PasswordReset.query().where('email', usuario.email).delete()
            const pr = await PasswordReset.create({email: usuario.email})
            await Mail.send('auth.reset-password-link', {url: Env.get('URL_APP'), token: pr.token, email: usuario.email}, message => {
              message.to(usuario.email).from(Env.get('DO_NOT_ANSWER_EMAIL')).subject('Solicitação de Alteração de Senha')
            })
          }
          return response.status(usuario ? 200 : 400).send(usuario ? {message: 'Um e-mail com link para reset foi enviado para o endereço informado!'} : {error:{message:'Email não encontrado!'}})
        }
        catch (error) {
          return response.status(400).send({error: {message: 'Ocorreu um erro inesperado ao executar a sua solicitação!', e: error.toString()}})
        }
      }
    
      async reset({ request, response }) {
        const { email, password } = request.only(['email', 'password'])
        try {
          const usuario = await Usuario.findByOrFail('email', email)
          usuario.merge({password})
          await usuario.save()
          return response.status(200).send({message: 'Senha alterada com sucesso!'})
        }
        catch (error) {
          return response.status(400).send({error: {message: 'Não foi possivel alterar a sua senha!', e: error.toString()}})
        }
      }

      async register({ request, response }){
        try {
          let dado = request.all()
          let senhaUsuario = dado.password ? dado.password : await getStringRandom(10)
          let user = await Usuario.create({
              nome: dado.nome,
              email: dado.email,
              cpf: dado.cpf,
              data_nascimento: dado.nascimento,
              password: dado.senha
          })
          if(user){
              if(dado.tipo_usuario == 'treinador'){
                let treinador = await Treinador.create({
                  user_id: user.id,
                  cref: dado.cref,
                })
                
                let role
                role = await Role.findBy('slug', 'treinador')
                if (role) {
                  await user.roles().detach()
                  await user.roles().attach(role.id, (row) => {
                    row.created_at = new Date()
                    row.updated_at = new Date()
                  })
                }
                return treinador ? treinador : response.status(400).send({ error: { message: 'Erro ao criar o treinador!' } })
              }else{
                let atleta = await Atleta.create({
                    user_id: user.id,
                    peso: dado.peso,
                    altura: dado.altura
                })

                let role
                role = await Role.findBy('slug', 'atleta')
                if (role) {
                  await user.roles().detach()
                  await user.roles().attach(role.id, (row) => {
                    row.created_at = new Date()
                    row.updated_at = new Date()
                  })
                }
                return atleta ? atleta : response.status(400).send({ error: { message: 'Erro ao criar Atleta!' } })
              }
          }
        }catch (error){
            return response.status(400).send({ error: { message: 'Erro ao criar Usuário!', e: error.toString() } })
        }
      }
}

module.exports = AuthController
