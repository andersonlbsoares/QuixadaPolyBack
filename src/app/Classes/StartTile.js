import Tile from "./Tile.js";

export default class StartTile extends Tile {
  constructor() {
    super("Início", 11, 11, "Você caiu no Início, receba $200.", "Receber", "passar");
  }

  onLand(player) {
    console.log(`${player.name} está no Início.`);
    return super.onLand(player);
  }

  onPass(player) {
    console.log(`${player.name} recebeu $200 por passar pelo Início.`);
    player.balance += 200;
  }
}
