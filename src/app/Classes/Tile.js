export default class Tile {
  constructor(name) {
    this.name = name;
  }

  onLand(player) {
    console.log(`${player.name} caiu em ${this.name}`);
  }
}
