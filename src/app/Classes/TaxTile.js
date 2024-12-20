import Tile from "./Tile.js";

export default class TaxTile extends Tile {
  constructor() {
    super("Imposto");
  }

  onLand(player) {
    super.onLand(player);
  }
}
