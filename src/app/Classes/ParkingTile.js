import Tile from "./Tile.js";

export default class ParkingTile extends Tile {
  constructor() {
    super("Estacionamento", 1, 1);
  }

  onLand(player) {
    super.onLand(player);
  }
}
