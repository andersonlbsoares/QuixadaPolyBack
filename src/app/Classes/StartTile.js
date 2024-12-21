import Tile from "./Tile.js";

export default class StartTile extends Tile {
  constructor() {
    super("Início", 11, 11);
  }

  onLand(player) {
    super.onLand(player);
    console.log(`${player.name} está no Início.`);
  }

  onPass(player) {
    console.log(`${player.name} recebeu $200 por passar pelo Início.`);
    player.balance += 200;
  }
}
