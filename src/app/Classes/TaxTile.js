import Tile from "./Tile.js";

export default class TaxTile extends Tile {
  constructor(name, row, column) {
    super(name, row, column);
  }

  onLand(player) {
    super.onLand(player);
  }
}
