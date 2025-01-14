import Tile from "./Tile.js";

export default class TaxTile extends Tile {
  constructor(name, row, column) {
    super(name, row, column, "Você caiu na malha fina, pague o leão! 🦁", "Pagar", "passar");
  }

  onLand(player) {
    let valor = Math.floor(Math.random() * 1000);
    valor = valor /2;
    if (player.balance < valor) {
      player.balance = 0;
      return `${player.name} Caiu na taxação do PIX e perdeu todo o seu saldo`;
    }else{
      player.balance -= valor;
      return `${player.name} Caiu na malha fina e perdeu $${valor}`;
    }
  }

}