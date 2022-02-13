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
}).prefix('auth')

Route.group(() => {
	//Treinador
		Route.get('perfil-treinador', 'TreinadorController.show').middleware(["auth"])
		Route.post('criarTreinador', 'TreinadorController.store')
		Route.put('alterar-perfil-treinador', 'TreinadorController.update').middleware(["auth"])
	//Fim Treinador

	//Atleta
		Route.get('perfil-atleta', 'AtletaController.show').middleware(["auth"])
		Route.post('criarAtleta', 'AtletaController.store')
		Route.put('alterar-perfil-atleta', 'AtletaController.update').middleware(["auth"])
	//Fim ATLETA

	//Equipe
		Route.post('criar-equipe/:treinador', 'EquipeController.post').middleware(["auth"])
		Route.put('alterar-dados-equipe/:id', 'EquipeController.update').middleware(["auth"])
		Route.get('buscar-atletas-equipe/:id', 'EquipeController.buscarAtletas').middleware(["auth"])
	//FIM EQUIPE

	//REQUISICAO EQUIPE
		Route.get('buscar-requisicoes-pendentes-equipe/:equipe', 'EquipeRequisicaoController.buscarRequisicoesPendentes').middleware(["auth"])
		Route.put('alterar-status-requisicao/:id', 'EquipeRequisicaoController.alterarStatus').middleware(["auth"])
		Route.delete('remover-atleta-equipe/:atleta/:equipe', 'EquipeRequisicaoController.removerAtletaEquipe').middleware(["auth"])
		Route.post('criar-requisicao-equipe/:atleta/:codigo_equipe', 'EquipeRequisicaoController.criar-requisicao').middleware(["auth"])
	//FIM REQUISICAO


	//CONSTRUINDO SESSAO TREINO
		//TREINO
			//CAMPOS
				Route.get('campos-sessao-treino/:sessao', 'TreinoController.buscaCampos').middleware(["auth"])
				Route.post('criar-campo-sessao/:sessao', 'TreinoController.criarCampo').middleware(["auth"])
			//FIM CAMPOS

			//SESSAO
				Route.get('buscar-sessoes-treino/:treino', 'TreinoController.buscarSessoes').middleware(["auth"])
				Route.post('criar-sessao-treino/:treino', 'TreinoController.criarSessao').middleware(["auth"])
			//FIM SESSAO
		//FIM TREINO
	//FIM CONTRUINDO SESSAO TREINO

}).prefix('api')

