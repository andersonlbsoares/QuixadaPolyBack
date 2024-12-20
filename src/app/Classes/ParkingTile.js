import Tile from "./Tile.js";

export default class ParkingTile extends Tile {
  constructor() {
    super("Estacionamento");
  }

  onLand(player) {
    super.onLand(player);
  }
}
