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
const routes = createRoutes(gameController);
app.use(routes);

export default app;
