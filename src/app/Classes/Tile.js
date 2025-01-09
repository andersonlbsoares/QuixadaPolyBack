export default class Tile {
  constructor(name, row, column) {
    this.name = name;
    this.row = row;
    this.column = column;
  }

  onLand(player) {
    console.log(`${player.name} caiu em ${this.name}`);
    return `${player.name} caiu em ${this.name}`;
  }
}
