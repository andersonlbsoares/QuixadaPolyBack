import Tile from "./Tile.js";

export default class JailTile extends Tile {
  constructor() {
    super("Prisão");
  }

  onLand(player) {
    super.onLand(player);
    console.log(`${player.name} não jogará a proxima rodada.`);
  }
}
