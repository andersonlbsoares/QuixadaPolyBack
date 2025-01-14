import Tile from "./Tile.js";

export default class JailTile extends Tile {
  constructor() {
    super("Prisão", 11, 1, "Você caiu na Prisão", "SOCORRO :(", "passar");
  }

  onLand(player) {
    player.setJailStatus(true);
    return super.onLand(player);
  }
}
