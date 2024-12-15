import Board from "./Board.js";
export default class SessionController {
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
			response.push({
				player,
				dice1: diceValues.die1,
				dice2: diceValues.die2,
				total: diceValues.total,
			});
		});
		return response;
	}

	// EXPERIMENTAL

	// Avança o turno do jogador
	playTurn() {
		if (!this.isGameRunning) {
			console.log("O jogo já terminou!");
			return;
		}

		const player = this.players[this.currentPlayerIndex];
		console.log(`Vez de ${player.name}`);

		if (player.isInJail) {
			this.handleJail(player);
		} else {
			const diceRoll = this.rollDice();
			this.movePlayer(player, diceRoll);
		}

		this.nextPlayer();
	}

	movePlayer(player, steps) {
		const previousPosition = player.position;
		player.move(steps, this.board.tiles.length);

		// Verifica se o jogador passou pelo Início
		if (previousPosition > player.position) {
			const startTile = this.board.getTile(0);
			if (startTile.onPass) {
				startTile.onPass(player);
			}
		}

		const currentTile = this.board.getTile(player.position);
		currentTile.onLand(player);

		if (player.balance <= 0) {
			console.log(`${player.name} foi à falência!`);
			this.removePlayer(player);
		}
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

	nextPlayer() {
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

		if (this.players.length === 1) {
			this.endGame();
		}
	}

	// Remove um jogador do jogo
	removePlayer(player) {
		console.log(`${player.name} está fora do jogo.`);
		this.players = this.players.filter((p) => p !== player);
	}

	// Finaliza o jogo
	endGame() {
		this.isGameRunning = false;
		console.log(`O jogo terminou! O vencedor é ${this.players[0].name}`);
	}

	statusGame() {
		return {
			session: this.sessionNumber,
			players: this.players,
			board: this.board,
			currentPlayer: this.players[this.currentPlayerIndex],
			isGameRunning: this.isGameRunning,
		};
	}
}
