export default class Tile {
  constructor(name, row, column, message=null, option1=null, route1=null, option2=null , route2=null) {
    this.name = name;
    this.row = row;
    this.column = column;
    this.feedback = {
      message: message,
      option1: option1,
      option2: option2,
      route1: route1,
      route2: route2,
    }
  }
  onLand(player) {
    return `${player.name} caiu em ${this.name}`;
  }
}
