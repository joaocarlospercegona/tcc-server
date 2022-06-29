'use strict'
const User = use('App/Models/User')
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
}

module.exports = UserController
