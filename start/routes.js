'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
	Route.post('login', 'AuthController.login')
	Route.post('register', 'AuthController.register')
}).prefix('auth')

Route.group(() => {
	//Treinador
		Route.get('perfil-treinador', 'TreinadorController.show')//.middleware(["auth"])
		//Route.post('criarTreinador', 'TreinadorController.store') 
		Route.put('alterar-perfil-treinador', 'TreinadorController.update')//.middleware(["auth"])
	//Fim Treinador

	//Usuario
		Route.get('verficarDadosUsuario', 'UserController.verficarDadosUsuario')
		Route.put('alterarDadosUsuario/:id', 'UserController.alterarDadosUsuario')
	//

	//Atleta
		Route.get('perfilAtleta/:id', 'AtletaController.perfilAtleta')//.middleware(["auth"]) OK - falta fazer a relacao com modalidades
		//Route.post('criarAtleta', 'AtletaController.store') // OK
		Route.put('alterar-perfil-atleta', 'AtletaController.update')//.middleware(["auth"]) 
		Route.put('relacionarAtletaModalidade/:id', 'AtletaController.relacionarModalidade') // OK
	//Fim ATLETA

	//Equipe
		Route.get('buscarEquipe/:id', 'EquipeController.show')
		Route.post('criarEquipe', 'EquipeController.store')//.middleware(["auth"]) OK
		Route.put('alterar-dados-equipe/:id', 'EquipeController.alterarDadosEquipe')//.middleware(["auth"]) OK
		Route.get('buscar-atletas-equipe/:equipe', 'EquipeController.buscarAtletas')//.middleware(["auth"]) OK
	//FIM EQUIPE

	//REQUISICAO EQUIPE -- OK
		Route.get('buscar-requisicoes-pendentes-equipe/:equipe', 'EquipeRequisicaoController.buscarRequisicoesPendentes')//.middleware(["auth"])
		Route.put('alteraStatusRequisicao/:id', 'EquipeRequisicaoController.alterarStatus')//.middleware(["auth"])
		Route.delete('deletaRequisicaoEquipe/:id', 'EquipeRequisicaoController.deletarRequisicaoEquipe')//.middleware(["auth"])
		
		Route.delete('remover-atleta-equipe/:atleta/:equipe', 'EquipeRequisicaoController.removerAtletaEquipe')//.middleware(["auth"])
		Route.post('criar-requisicao-equipe', 'EquipeRequisicaoController.criarRequisicao')
	//FIM REQUISICAO

	Route.get('buscar-equipes', 'EquipeController.index')//.middleware(["auth"])
	Route.get('verificar-email', 'UserController.verificarEmail')//.middleware(["auth"])

	//CONSTRUINDO SESSAO TREINO
			//SESSAO
				Route.get('buscar-sessoes-treino/:treino', 'TreinoController.buscarSessoes')//.middleware(["auth"])
				Route.post('criar-sessao-treino/:treino', 'TreinoController.criarSessao')//.middleware(["auth"])
			//FIM SESSAO
	//FIM CONTRUINDO SESSAO TREINO

}).prefix('api')

