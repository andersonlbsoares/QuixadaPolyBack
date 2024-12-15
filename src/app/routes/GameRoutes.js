import SessionController from "../Classes/SessionController.js";

import express from "express";
const router = express.Router();

router.get("/iniciar", (req, res) => {
	const game = new SessionController();
	let sessao = game.startSession();
	res.status(200).json({ message: "Jogo iniciado", sessao });
});

router.get("/status", (req, res) => {
	const sessao = req.params.sessao;
	const game = SessionController.getSession(sessao);
	if (!game) {
		res.status(404).json({ message: "Sessão não encontrada" });
		return;
	}

	res.status(200).json(game.getSessionStatus());
});

export default router;
