'use strict'

const Mail = use('Mail')
const Env = use('Env')
const Database = use('Database')
const Role = use('Role')
const Tipo = use('App/Models/TipoUsuario')
const { getStringRandom } = use('App/Helpers')

const PasswordReset = use('App/Models/PasswordReset')
const Usuario = use('App/Models/User')

const criarUsuario = async (dado) => {
	let dadosUsuario = {
		nome: dado.nome,
		email: dado.email,
		password: dado.password ? dado.password : await getStringRandom(10),
		ativo: dado.password ? true : false,
		tipo_usuario_id: dado.tipo_usuario_id,
		celular: dado.celular,
		numero_cpf: dado.cpf_cnpj || dado.cpf
	}
	const user = await Usuario.create(dadosUsuario)
	let role
	let TipoUsuario = await Tipo.findBy('id', dado.tipo_usuario_id)

	if (TipoUsuario.nome == 'Administradora') role = await Role.findBy('slug', 'admin')
	if (TipoUsuario.nome == 'Cliente') role = await Role.findBy('slug', 'cliente')
	if (TipoUsuario.nome == 'Entregadora') role = await Role.findBy('slug', 'entregadora')

	let urlDestino
	if (TipoUsuario.nome == 'Administradora') {
		urlDestino = '' + Env.get('URL_PAINEL') + ''
	}
	if (TipoUsuario.nome != 'Administradora') {
		urlDestino = '' + Env.get('URL_APLICATIVO') + ''
	}

	await user.roles().detach()
	await user.roles().attach([role.id], (row) => {
		row.created_at = new Date()
		row.updated_at = new Date()
	})

	//Enviar Email de recuperação de senha caso não tenha sido informado a senha no cadastro
	if (!dado.password && user.email && user.email != '') {
		await Mail.send('usuario.reset-password-link', { url: Env.get('URL_APP'), url_server: Env.get('URL_SERVER'), password: dadosUsuario.password, email: user.email, urlDestino: urlDestino }, (message) => {
			message.to(user.email).from(Env.get('DO_NOT_ANSWER_EMAIL')).subject('Inclusão no sistema - Cliente')
		})
	}

	return user
}

module.exports = {
	criarUsuario
}
