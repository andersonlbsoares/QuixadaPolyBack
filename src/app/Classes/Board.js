import StartTile from "./StartTile.js";
import Property from "./Property.js";
import JailTile from "./JailTile.js";
import GoToJailTile from "./GoToJailTile.js";

export default class Board {
  constructor() {
    this.tiles = [];
    this.setupTiles();
  }

  setupTiles() {
    this.tiles.push(new StartTile());
    this.tiles.push(new Property("Av. Paulista", 200, 50));
    this.tiles.push(new JailTile());
    this.tiles.push(new GoToJailTile());
  }

  getTile(position) {
    return this.tiles[position];
  }
}
