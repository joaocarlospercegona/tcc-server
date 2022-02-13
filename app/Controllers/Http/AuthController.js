'use strict'
const Env = use('Env')
const Usuario = use('App/Models/User')
const Token = use('App/Models/Token')
class AuthController {
      async login({ request, response, auth }) {
        const { email, password } = request.all()
        console.log('email', email, 'senha', password)
        let u = await Usuario.query().where('email',email).first()
        if (!u) return response.status(400).send({error: {message: 'Login errado!'}})
        let rs = {usuario:u.toJSON()}
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
}

module.exports = AuthController
