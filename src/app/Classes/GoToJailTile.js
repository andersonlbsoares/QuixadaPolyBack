import Tile from "./Tile.js";

export default class GoToJailTile extends Tile {
  constructor() {
    super("Vá para a Prisão", 1, 11);
  }

  onLand(player) {
    console.log(`${player.name} foi enviado para a Prisão!`);
    player.position = 10;
    return super.onLand(player);
  }
}
