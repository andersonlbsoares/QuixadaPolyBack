import Tile from "./Tile.js";

export default class JailTile extends Tile {
  constructor() {
    super("Prisão", 11, 1);
  }

  onLand(player) {
    return super.onLand(player);
  }
}
