import Tile from "./Tile.js";

export default class BadLuckTile extends Tile {
  constructor(name, row, column) {
    super(name, row, column);
  }

  onLand(player) {
    return super.onLand(player);
  }
}
