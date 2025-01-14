import Tile from "./Tile.js";

export default class BadLuckTile extends Tile {
  constructor(name, row, column) {
    super(name, row, column, "Você caiu em uma carta de má sorte", "Má Sorte", "passar", "Má Sorte", "passar");
  }

  onLand(player) {
    let valor = Math.floor(Math.random() * 1000);
    valor = valor /2;
    if (player.balance < valor) {
      player.balance = 0;
      return `${player.name} tirou uma carta de azar e perdeu todo o seu saldo`;
    }else{
      player.balance -= valor;
      return `${player.name} tirou uma carta de azar e perdeu $${valor}`;
    }
  }
}
