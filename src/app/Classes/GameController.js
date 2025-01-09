export default class GameController {
	sessoes;
	constructor() {
		this.sessoes = [];
	}

	adicionarSessao(sessao) {
		this.sessoes.push(sessao);
	}

	removerSessao(sessionNumber) {
		this.sessoes = this.sessoes.filter((sessao) => sessao.sessionNumber !== parseInt(sessionNumber));
		console.log(this.sessoes);
	}

	obterSessoes() {
		return this.sessoes;
	}

	obterSessao(sessionNumber) {
		return this.sessoes.find((sessao) => sessao.sessionNumber === parseInt(sessionNumber));
	}
}
