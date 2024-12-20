import Board from "./Board.js";
export default class SessionController {
	anotacoes = [];
	sessionNumber;
	players = [];
	board;
	currentPlayerIndex;
	isGameRunning;

	constructor(sessionNumber) {
		this.board = new Board();
		this.currentPlayerIndex = 0;
		this.isGameRunning = false;
		this.sessionNumber = sessionNumber || startGame();
	}

	startGame() {
		const sessionNumber = Math.floor(Math.random() * 1000);
		this.sessionNumber = sessionNumber;
		this.anotacoes.push(`Sessão ${sessionNumber} iniciada`);
		return sessionNumber;
	}

	startSession() {
		if (this.players.length < 2) {
			return { message: "Less then 2 players", code: 1 };
		} else if (this.isGameRunning) {
			return { message: "Game already running", code: 2 };
		} else {
			this.isGameRunning = true;
			return { message: "Game started", code: 0 };
		}
	}

	addPlayer(player) {
		this.players.push(player);
		this.anotacoes.push(`O Jogador ${player.name} entrou na sessão ${this.sessionNumber}`);
	}

	rollDice() {
		const die1 = Math.floor(Math.random() * 6) + 1;
		const die2 = Math.floor(Math.random() * 6) + 1;
		return {
			die1,
			die2,
			total: die1 + die2,
		};
	}

	choiceFistPlayer() {
		let value = 0;
		let response = [];
		this.players.forEach((player) => {
			let diceValues = this.rollDice();
			if (value < diceValues.total) {
				this.currentPlayerIndex = this.players.indexOf(player);
			}
			this.anotacoes.push(`O Jogador ${player.name} tirou ${diceValues.total}`);
			response.push({
				player,
				dice1: diceValues.die1,
				dice2: diceValues.die2,
				total: diceValues.total,
			});

		});
		return response;
	}

	playTurn(playerName) {
		if (!this.isGameRunning) {
			console.log("O jogo já terminou!");
			return;
		}

		const player = this.players[this.currentPlayerIndex];
		if (player.name !== playerName) {
			console.log("Não é a vez desse jogador! esperando: ", player.name);
			return { message: "Não é sua vez", code: 1 };
		}
		if (player.isInJail) {
			this.handleJail(player);
		} else {
			const diceRoll = this.rollDice();
			this.anotacoes.push(`O Jogador ${player.name} tirou ${diceRoll.total}`);
			this.movePlayer(player, diceRoll.total);
		}
		return this.statusGame();
	}

	getPlayer(playerName) {
		return this.players.find((player) => player.name === playerName);
	}

	movePlayer(player, steps) {
		const previousPosition = player.position;
		player.move(steps, this.board.tiles.length);

		if (previousPosition > player.position) {
			const startTile = this.board.getTile(0);
			if (startTile.onPass) {
				startTile.onPass(player);
			}
		}

		const currentTile = this.board.getTile(player.position);
		this.anotacoes.push(`${player.name} caiu em ${currentTile.name}`);
		let state = currentTile.onLand(player);
		this.anotacoes.push(state);

		if (player.balance <= 0) {
			console.log(`${player.name} foi à falência!`);
			this.anotacoes.push(`${player.name} foi à falência!`);
			this.removePlayer(player);
		}
	}

	nextPlayer() {
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

		if (this.players.length === 1) {
			this.endGame();
		}
	}
	
	buyProperty(player) {
		console.log("Comprando propriedade", player);
		const currentTile = this.board.getTile(player.position);
		if (currentTile.owner) {
			console.log("A propriedade já tem dono.");
			return;
		}

		if (player.balance < currentTile.price) {
			console.log("Saldo insuficiente.");
			return;
		}

		if (currentTile.price) {
			player.balance -= currentTile.price;
			currentTile.owner = player;
			
			console.log(`${player.name} comprou ${currentTile.name} por ${currentTile.price}.`);
			this.anotacoes.push(`${player.name} comprou ${currentTile.name} por ${currentTile.price}.`);
			this.nextPlayer();
			return this.statusGame();
		}else{
			this.anotacoes.push("A propriedade não está à venda.");
			return ({ message: "A propriedade não está à venda.", code: 1 });
		}
	}

	endTurn(player) {
		this.nextPlayer();
		this.anotacoes.push(`O Jogador ${player.name} terminou o turno.`);
		return this.statusGame();
	}
	
	handleJail(player) {
		console.log(`${player.name} está na prisão.`);
		player.turnsInJail += 1;

		if (player.turnsInJail >= 3) {
			console.log(`${player.name} foi libertado da prisão após 3 turnos.`);
			player.isInJail = false;
			player.turnsInJail = 0;
		} else {
			console.log(`${player.name} deve esperar.`);
		}
	}

	removePlayer(player) {
		console.log(`${player.name} está fora do jogo.`);
		this.players = this.players.filter((p) => p !== player);
	}

	endGame() {
		this.isGameRunning = false;
		console.log(`O jogo terminou! O vencedor é ${this.players[0].name}`);
	}

	statusGame() {
		return {
			anotacoes: this.anotacoes,
			session: this.sessionNumber,
			players: this.players,
			board: this.board,
			currentPlayer: this.players[this.currentPlayerIndex],
			isGameRunning: this.isGameRunning,
		};
	}
}
