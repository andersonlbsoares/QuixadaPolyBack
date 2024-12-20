import Tile from "./Tile.js";

export default class LuckTile extends Tile {
  constructor() {
    super("Sorte");
  }

  onLand(player) {
    super.onLand(player);
  }
}
