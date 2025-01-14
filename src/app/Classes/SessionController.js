import Board from "./Board.js";
import Property from "./Property.js";
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
		this.sessionNumber = sessionNumber || this.startGame();
	}

	//MANIPULAÇÃO DE PLAYER
	addPlayer(player) {
		this.players.push(player);
		this.anotacoes.push(`O Jogador ${player.name} entrou na sessão ${this.sessionNumber}`);
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
		let state = currentTile.onLand(player);
		this.anotacoes.push(state);
		
	}

	nextPlayer() {
		let player;
		do{
			this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
			player = this.players[this.currentPlayerIndex];
		}while(player.isBankrupt);
		player.status = "your turn";
		
	}

	bankruptcy(player, playerToPay) {
		let propertiesValue = 0;
		this.board.tiles.forEach((tile) => {
			if (tile.owner === player) {
				propertiesValue += tile.price;
			}
		});
		playerToPay.balance += propertiesValue;
		player.setBankruptStatus(true);
		anotacoes.push(`${player.name} foi à falência`);
		anotacoes.push(`${playerToPay.name} recebeu a bolada de $${propertiesValue}`);
	}


	// AÇÃO DOS PLAYERS
	rollDice() {
		const die1 = Math.floor(Math.random() * 6) + 1;
		const die2 = Math.floor(Math.random() * 6) + 1;
		return {
			die1,
			die2,
			total: die1 + die2,
		};
	}
	
	checkWinner(){
		//checa se só tem um player isBankrupt false
		let winner = this.players.filter((player) => !player.isBankrupt);
		if(winner.length == 1 && this.players.length > 1){
			return winner[0].name;
		}
		return false;
	}

	checkAction(playerName) {
		const player = this.getPlayer(playerName);
		const currentTile = this.board.getTile(player.position);
	
		const resposta = {
			message: "",
			button1: "",
			button2: "",
			route1: "",
			route2: "",
			properties: []
		};
		
		const winner = this.checkWinner();
		if (winner) {
			resposta.message = `O vencedor é ${winner}`;
			resposta.button1 = winner;
			return resposta
		} else if (player.status === "not your turn") {
			resposta.message = "Não é sua vez.";
			return resposta;
		}else if (player.status === "your turn") {
			resposta.message = "Sua vez, role os dados.";
			return resposta;
		}
	
		if (currentTile instanceof Property) {
			this.handlePropertyTile(player, currentTile, resposta)
		}
		else {
			this.handleNonPropertyTile(currentTile, resposta);
		}
	
		return resposta;
	}

	playTurn(playerName) {
		if (!this.isGameRunning) {
			console.log("O jogo já terminou!");
			return { message: "O jogo já terminou ou ainda nem começou", code: 1 };
		}

		let dice1;
		let dice2;

		const player = this.players[this.currentPlayerIndex];
		if (player.name !== playerName) {
			console.log("Não é a vez desse jogador! esperando: ", player.name);
			return { message: "Não é sua vez", code: 1 };
		}
		if (player.isInJail) {
			const diceRoll = this.rollDice();
			if (diceRoll.die1 === diceRoll.die2) {
				this.anotacoes.push(`${player.name} tirou ${diceRoll.total} e foi libertado da prisão.`);
				player.isInJail = false;
				player.turnsInJail = 0;
				dice1 = diceRoll.die1;
				dice2 = diceRoll.die2;
				this.movePlayer(player, diceRoll.total);
			}else{
				player.turnsInJail += 1;
				this.anotacoes.push(`${player.name} está na prisão (${player.turnsInJail}/2).`);
			}
			
			if (player.turnsInJail >= 2) {
				this.anotacoes.push(`${player.name} foi libertado da prisão após 2 turnos.`);
				player.isInJail = false;
				player.turnsInJail = 0;
				this.movePlayer(player, diceRoll.total);
			}

		} else {
			const diceRoll = this.rollDice();
			this.anotacoes.push(`O Jogador ${player.name} tirou ${diceRoll.total}`);
			dice1 = diceRoll.die1;
			dice2 = diceRoll.die2;
			this.movePlayer(player, diceRoll.total);
		}
		player.status = "waiting action";
		let status = this.statusGame();

		status.diceRoll = { dice1, dice2 };
		return status; 
	}

	endTurn(player) {
		player.status = "not your turn";
		this.nextPlayer();
		this.anotacoes.push(`O Jogador ${player.name} terminou o turno.`);
		return this.statusGame();
	}

	buyProperty(player) {
		console.log("Comprando propriedade", player);
		player.status = "not your turn";
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
			currentTile.houses = 1;
			
			console.log(`${player.name} comprou ${currentTile.name} por ${currentTile.price}.`);
			this.anotacoes.push(`${player.name} comprou ${currentTile.name} por ${currentTile.price}.`);
			this.nextPlayer();
			
			return this.statusGame();
		}else{
			this.anotacoes.push("A propriedade não está à venda.");
			return ({ message: "A propriedade não está à venda.", code: 1 });
		}
	}

	sellProperty(player, propertyName) {
		const property = this.board.tiles.find((tile) => tile.name === propertyName);
		if (!property) {
			console.log("Propriedade não encontrada.");
			return;
		}

		if (property.owner !== player) {
			console.log("Essa propriedade não é sua.");
			return;
		}

		player.balance += property.price;
		property.owner = null;
		this.anotacoes.push(`${player.name} vendeu ${property.name} por ${property.price}.`);
	}


	// MANIPULAÇÃO DE SESSÃO
	startGame() {
		const sessionNumber = Math.floor(Math.random() * 1000);
		this.sessionNumber = sessionNumber;
		this.anotacoes.push(`Sessão iniciada`);
		return sessionNumber;
	}

	endGame() {
		this.isGameRunning = false;
		console.log(`O jogo terminou! O vencedor é ${this.players[0].name}`);
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

	choiceFistPlayer() {
		let value = 0;
		let response = [];
		this.players.forEach((player) => {

			let diceValues = this.rollDice();
			if (value < diceValues.total) {
				value = diceValues.total;
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
		this.anotacoes.push(`O Jogador ${this.players[this.currentPlayerIndex].name} começa o jogo.`);
		let player = this.players[this.currentPlayerIndex];
		player.status = "your turn";
		return response;
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


	// Funções auxiliares
	handlePropertyTile(player, currentTile, resposta) {
		if (currentTile.owner === player) {
			this.handleOwnProperty(currentTile, resposta);
		} else if (currentTile.owner) {
			this.handleOtherPlayerProperty(player, currentTile, resposta);
		} else {
			this.handleUnownedProperty(player, currentTile, resposta);
		}
	}
	handleOwnProperty(currentTile, resposta) {
		resposta.message = `Você caiu em ${currentTile.name} que é sua propriedade, você pode construir por ${ (currentTile.price / 2).toFixed(2)} ou finalizar o turno.`;
		resposta.button1 = "Finalizar Turno";
		resposta.route1 = "passar";
		resposta.button2 = "Construir";
		resposta.route2 = "construir";
	}
	handleOtherPlayerProperty(player, currentTile, resposta) {
		if (player.balance >= currentTile.rent) {
			resposta.message = `Você caiu em ${currentTile.name} que é de ${currentTile.owner.name} pague o aluguel de ${currentTile.rent}`;
			resposta.button1 = "Pagar Aluguel";
			resposta.button2 = "Falência";
			resposta.route1 = "pagar";
			resposta.route2 = "falencia";
		} else {
			resposta.message = `Você caiu em ${currentTile.name} que é de ${currentTile.owner.name} mas você não tem dinheiro suficiente para pagar o aluguel.`;
			resposta.properties = this.board.tiles.filter(tile => tile.owner === player);
		}
	}
	handleUnownedProperty(player, currentTile, resposta) {
		if (player.balance >= currentTile.price) {
			resposta.message = `Você caiu em ${currentTile.name} que está disponível para compra por ${currentTile.price}`;
			resposta.button1 = "Comprar";
			resposta.route1 = "comprar";
			resposta.button2 = "Não Comprar";
			resposta.route2 = "passar";
		} else {
			resposta.message = `Você caiu em ${currentTile.name} que está disponível para compra por ${currentTile.price} mas você não tem dinheiro suficiente.`;
			resposta.button1 = "Não Comprar";
			resposta.route1 = "passar";
		}
	}
	handleNonPropertyTile(currentTile, resposta) {
		resposta.message = currentTile.feedback.message;
		resposta.button1 = currentTile.feedback.option1;
		resposta.button2 = currentTile.feedback.option2;
		resposta.route1 = currentTile.feedback.route1;
		resposta.route2 = currentTile.feedback.route2;
	}

}