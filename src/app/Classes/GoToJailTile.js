import Tile from "./Tile.js";

export default class GoToJailTile extends Tile {
  constructor() {
    super("Vá para a Prisão");
  }

  onLand(player) {
    super.onLand(player);
    console.log(`${player.name} foi enviado para a Prisão!`);
    player.position = 10;
  }
}
