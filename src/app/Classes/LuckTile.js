import Tile from "./Tile.js";

export default class LuckTile extends Tile {
  constructor(nome, row, column) {
    super(nome, row, column);
  }

  onLand(player) {
    return super.onLand(player);
  }
}
