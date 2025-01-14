import Tile from "./Tile.js";

export default class GoToJailTile extends Tile {
  constructor() {
    super("Vá para a Prisão", 1, 11, "Você caiu em Vá para a Prisão! Vá direto para a prisão!", "Ir para a Prisão", "passar");
  }

  onLand(player) {
    player.position = 10;
    return `${player.name} foi enviado para a Prisão!`;
  }
}
