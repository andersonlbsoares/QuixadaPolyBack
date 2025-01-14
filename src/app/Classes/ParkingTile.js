import Tile from "./Tile.js";

export default class ParkingTile extends Tile {
  constructor() {
    super("Estacionamento", 1, 1, "Você caiu no Estacionamento, estacionamento gratuito.", "Finalizar Turno", "passar");
  }

  onLand(player) {
    return super.onLand(player);
  }
}
