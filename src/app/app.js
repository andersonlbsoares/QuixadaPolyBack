import express from "express";
import GameController from "./Classes/GameController.js";
import cors from "cors";
import createRoutes from "./routes.js";

const app = express();
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	})
);

app.use(express.json());

const gameController = new GameController();

import SessionController from "./Classes/SessionController.js";
import Player from "./Classes/Player.js";
const sessao = new SessionController(579);
const player1 = new Player("Jogador 1", "#ff0000");
const player2 = new Player("Jogador 2", "#ffff00");
gameController.adicionarSessao(sessao);
sessao.addPlayer(player1);
sessao.addPlayer(player2);

const routes = createRoutes(gameController);
app.use(routes);

export default app;
