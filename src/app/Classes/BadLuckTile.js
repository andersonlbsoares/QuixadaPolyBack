import Tile from "./Tile.js";

export default class BadLuckTile extends Tile {
  constructor() {
    super("Má Sorte");
  }

  onLand(player) {
    super.onLand(player);
  }
}
