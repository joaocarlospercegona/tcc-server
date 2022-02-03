'use strict'

const crypto = use('crypto')
const Role = use('Role')

const getStringRandom = async (tamanho = 40) => {
	let string = ''
	let len = string.length
	if (len < tamanho) {
		let size = tamanho - len
		let bytes = await crypto.randomBytes(size)
		let buffer = new Buffer(bytes)
		string += buffer
			.toString('base64')
			.replace(/[^a-zA-Z0-9]/g, '')
			.substr(0, size)
	}
	return string
}

const getUsuarioPerfis = async (u) => {
	let roles = []
	for (let item of await u.getRoles()) {
		let r = await Role.findBy('slug', item)
		roles.push(r.toJSON())
	}
	return roles.sort(function (a, b) {
		if (a.name < b.name) return -1
		if (a.name > b.name) return 1
		else return 0
	})
}

const countColetaRecusas = async (coleta_id) => {
	try {
		let coleta = await use('App/Models/Coleta').query().where('id', coleta_id).first()
		if (coleta) {
			let lista = (await use('Database').raw('select count(e.id) from entregadoras e,veiculos v where e.veiculo_id=v.id and v.veiculo like ? ' + 'and e.id not in(select entregadora_id from coletas_recusadas where coleta_id=?)', ['%' + coleta.tipo_veiculo + '%', coleta.id])).rows
			return parseInt(lista[0].count)
		}
	} catch (e) {}
	return null
}

const getDistanciaEntre2pontos = (ponto1, ponto2) => {
	let grausParaRadiano = function (deg) {
		return deg * (Math.PI / 180)
	}

	let raioTerra = 6371
	let deltaLat = grausParaRadiano(ponto2.lat - ponto1.lat)
	let deltaLng = grausParaRadiano(ponto2.lng - ponto1.lng)

	//Formulas malucas
	let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(grausParaRadiano(ponto1.lat)) * Math.cos(grausParaRadiano(ponto1.lat)) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	return (raioTerra * c * 1000).toFixed()
}

const criarFinanceiro = async (coleta) => {
	const Financeiro = use('App/Models/Financeiro')
	let financeiro = await Financeiro.create({
		descricao: 'Entrega ' + coleta.id,
		valor: coleta.valor_entrega,
		coleta_id: coleta.id,
		vencimento: coleta.created_at,
		formaPagamento: coleta.forma_pagamento ? coleta.forma_pagamento : '',
		tipo: 'A receber',
		status: 'Pendente',
		cliente_id: coleta.cliente_id,
		entregadora_id: coleta.entregadora_id ? coleta.entregadora_id : null,
		criadoEntrega: 'Sim'
	})
	await Financeiro.create({
		descricao: 'Entrega ' + coleta.id,
		valor: coleta.comissao_entrega,
		coleta_id: coleta.id,
		vencimento: coleta.created_at,
		formaPagamento: coleta.forma_pagamento ? coleta.forma_pagamento : '',
		tipo: 'A pagar',
		status: 'Pendente',
		cliente_id: coleta.cliente_id,
		entregadora_id: coleta.entregadora_id ? coleta.entregadora_id : null,
		criadoEntrega: 'Sim'
	})
	return financeiro
}

module.exports = {
	getStringRandom,
	getUsuarioPerfis,
	countColetaRecusas,
	getDistanciaEntre2pontos,
	criarFinanceiro
}
