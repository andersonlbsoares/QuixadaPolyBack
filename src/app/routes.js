import express from "express";
import SessionController from "./Classes/SessionController.js";
import Player from "./Classes/Player.js";
import createSessionUserMiddleware from './services/SessionUserMiddleware.js';
const router = express.Router();

export default (gameController) => {
	const SessionUserMiddleware = createSessionUserMiddleware(gameController);
	//GameController
	router.post("/sessao", (req, res) => {
		const novaSessao = new SessionController();
		gameController.adicionarSessao(novaSessao);
		res.status(201).send(novaSessao);
	});

	router.get("/sessoes", (req, res) => {
		res.send(gameController.obterSessoes());
	});

	router.get("/sessao/:sessionNumber", (req, res) => {
		const sessionNumber = req.params.sessionNumber;
		const sessao = gameController.obterSessao(sessionNumber);
		if (!sessao) {
			res.status(404).send({ message: "Sessão não encontrada" });
			return;
		}
		res.send(gameController.obterSessao(sessionNumber));
	});

	router.delete("/sessao/:sessionNumber", (req, res) => {
		const sessionNumber = req.params.sessionNumber;
		gameController.removerSessao(sessionNumber);
		res.status(204).send();
	});

	//Sessão
	router.post("/sessao/:sessionNumber/jogador", (req, res) => {
		const sessionNumber = req.params.sessionNumber;
		let session = gameController.obterSessao(sessionNumber);
		if (!session) {
			res.status(404).send({ message: "Sessão não encontrada" });
			return;
		}

		const newPlayer = new Player(req.body.name, req.body.color);
		const playerExist = session.players.some((player) => player.name === newPlayer.name);

		if (playerExist) {
			res.status(409).send({ message: "Jogador já existe na sessão" });
			return;
		}
		session.addPlayer(newPlayer);

		res.status(201).send(session);
	});

	router.post("/sessao/:sessionNumber/comecar", (req, res) => {
		const sessionNumber = req.params.sessionNumber;
		let session = gameController.obterSessao(sessionNumber);
		if (!session) {
			res.status(404).send({ message: "Sessão não encontrada" });
			return;
		}
		let response = session.startSession();
		if (response.code === 1) {
			res.status(400).send(response);
			return;
		} else if (response.code === 2) {
			res.status(409).send(response);
			return;
		}
		let diceRolls = session.choiceFistPlayer();
		response.diceRolls = diceRolls;
		res.status(200).send(response);
	});

	//Jogar
	router.get("/sessao/:sessionNumber/checaopcoes", SessionUserMiddleware, (req, res) => {
		let session = req.session;
		let response = session.checkAction(req.player.name);
		res.status(200).send(response);
	});

	router.get("/sessao/:sessionNumber/jogar", SessionUserMiddleware, (req, res) => {
		let player = req.player;
		if(player.getStatus() === "waiting action"){
			res.status(403).send(response);
			return;
		}
		let session = req.session;
		let response = session.playTurn(req.player.name);
		if(response.code === 1){
			res.status(403).send(response);
			return;
		}
		res.status(200).send(response);
	}
	);

	router.get("/sessao/:sessionNumber/comprar", SessionUserMiddleware, (req, res) => {
		let session = req.session;
		let response = session.buyProperty(req.player);
		if(response?.code === 1){
			res.status(403).send(response);
			return;
		}
		res.status(200).send(response);
	}
	);

	router.get("/sessao/:sessionNumber/passar", SessionUserMiddleware, (req, res) => {
		const player = req.player;
		let session = req.session;
		let response = session.endTurn(player);
		if(response.code === 1){
			res.status(403).send(response);
			return;
		}
		res.status(200).send(response);
	}
	);

	router.get("/sessao/:sessionNumber/construir", SessionUserMiddleware, (req, res) => {
		let tile = req.tile;
		let session = req.session;
		let response = tile.buildHouse();
		session.endTurn(req.player);
		res.status(200).send(response);
	});

	router.get("/sessao/:sessionNumber/pagar", SessionUserMiddleware, (req, res) => {
		let player = req.player;
		let tile = req.tile;
		let session = req.session;
		let response = player.payRent(tile.rent);
		let owner = tile.owner.balance;
		owner.receiveRent(tile.rent);
		if(response?.code === 1){
			res.status(403).send(response);
			return;
		}
		session.endTurn(player);
		res.status(200).send(response);
	});

	router.get("/sessao/:sessionNumber/falencia", SessionUserMiddleware, (req, res) => {
		let player = req.player;
		let tile = req.tile;
		let session = req.session;
		let playerToPay = tile.owner;
		session.bankruptcy(player, playerToPay);
		res.status(200).send({message: "Falência realizada com sucesso"});	
	});

	//vender
	router.get("/sessao/:sessionNumber/vender/:propertyName", SessionUserMiddleware, (req, res) => {
		let session = req.session;
		let player = req.player;
		let propertyName = req.params.propertyName;
		let response = session.sellProperty(player, propertyName);
		res.status(200).send(response);
	});

	return router;
};
