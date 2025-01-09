import Board from "./Board.js";
import Property from "./Property.js";
import LuckTile from "./LuckTile.js";
import BadLuckTile from "./BadLuckTile.js";
import TaxTile from "./TaxTile.js";
import JailTile from "./JailTile.js";
import GoToJailTile from "./GoToJailTile.js";
import ParkingTile from "./ParkingTile.js";
import StartTile from "./StartTile.js";

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
	
	removePlayer(player) {
		console.log(`${player.name} está fora do jogo.`);
		this.players = this.players.filter((p) => p !== player);
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
		console.log("tile",currentTile);
		console.log("estado",state);
		this.anotacoes.push(state);

		if (player.balance <= 0) {
			console.log(`${player.name} foi à falência!`);
			this.anotacoes.push(`${player.name} foi à falência!`);
			this.removePlayer(player);
		}
	}

	nextPlayer() {
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
		let player = this.players[this.currentPlayerIndex];
		player.status = "your turn";
		if (this.players.length === 1) {
			this.endGame();
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

	checkAction(playerName){
		let player = this.getPlayer(playerName);
		let currentTile = this.board.getTile(player.position);
		
		let resposta = {
			message: "",
			button1: "",
			button2: "",
			route1: "",
			route2: ""
		}

		if(player.status == "not your turn"){
			resposta.message = "Não é sua vez.";
			return resposta;
		}
		if (player.status == "your turn") {
			resposta.message = "Sua vez, role os dados.";
			return resposta;
		}

		if(currentTile instanceof Property){
			if(currentTile.owner == player){
				resposta.message = "Você caiu em " + currentTile.name + " que é sua propriedade, você pode construir por " + (currentTile.price/2).toFixed(2) + " ou finalizar o turno.";
				resposta.button1 = "Finalizar Turno";
				resposta.button2 = "Construir";
				resposta.route1 = "passar";
				resposta.route2 = "passar";
				return resposta;
			}else if(currentTile.owner != player && currentTile.owner){
				resposta.message = "Você caiu em " + currentTile.name + " que é de " + currentTile.owner.name + " pague o aluguel de " + currentTile.rent;
				resposta.button1 = "Pagar Aluguel";
				resposta.button2 = "Falência";
				resposta.route1 = "passar";
				resposta.route2 = "passar";
				return resposta;
			} else {
				if (player.balance >= currentTile.price) {
				resposta.message = "Você caiu em " + currentTile.name + " que está disponível para compra por " + currentTile.price;
				resposta.button1 = "Comprar";
				resposta.button2 = "Não Comprar";
				resposta.route1 = "comprar";
				resposta.route2 = "passar";
				} else {
					resposta.message = "Você caiu em " + currentTile.name + " que está disponível para compra por " + currentTile.price + " mas você não tem dinheiro suficiente.";
					resposta.button1 = "Não Comprar";
					resposta.route1 = "passar";
				}
				return resposta;
			}
		} else if(currentTile instanceof LuckTile){
			resposta.message = "Você caiu em " + currentTile.name + " tire uma carta de sorte.";
			resposta.button1 = "Sorte";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";
			return resposta;
		} else if(currentTile instanceof BadLuckTile){
			resposta.message = "Você caiu em " + currentTile.name + " tire uma carta de má sorte.";
			resposta.button1 = "Má Sorte";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";
			return resposta;
		} else if(currentTile instanceof TaxTile){
			resposta.message = "Você caiu em " + currentTile.name + " pague o imposto de " + currentTile.tax;
			resposta.button1 = "Pagar";
			resposta.button2 = "Falência";
			resposta.route1 = "passar";
			resposta.route2 = "passar";
			return resposta;
		} else if(currentTile instanceof JailTile){
			resposta.message = "Você caiu em " + currentTile.name + " vá para a prisão.";
			resposta.button1 = "Ir para a prisão";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";
			return resposta;
		} else if(currentTile instanceof GoToJailTile){
			resposta.message = "Você caiu em " + currentTile.name + " vá para a prisão.";
			resposta.button1 = "Ir para a prisão";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";			
			
			return resposta
		} else if(currentTile instanceof ParkingTile){
			resposta.message = "Você caiu em " + currentTile.name + " estacionamento gratuito.";
			resposta.button1 = "Finalizar Turno";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";
			return resposta
		} else if(currentTile instanceof StartTile){
			resposta.message = "Você caiu em " + currentTile.name + " receba 200";
			resposta.button1 = "Receber";
			resposta.button2 = "";
			resposta.route1 = "passar";
			resposta.route2 = "";
			return resposta
		}

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
			this.handleJail(player);
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

	



	





}
