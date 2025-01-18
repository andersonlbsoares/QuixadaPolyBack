import Tile from "./Tile.js";

export default class LuckTile extends Tile {
  constructor(nome, row, column) {
    super(nome, row, column, "Você caiu em uma carta de sorte", "Legal", "passar", "Show :)", "passar");
  }

  onLand(player) {
    if (Math.random() > 0.7) {
      let valor = Math.floor(Math.random() * 1000);
      player.balance += valor;
      return `${player.name} tirou uma carta de sorte e ganhou $${valor}`;
    } else {
      let porcentagem = Math.floor(Math.random() * 50);
      let valor = Math.floor(player.balance * porcentagem / 100);
      player.balance = player.balance + (player.balance * porcentagem / 100);
      return `${player.name} tirou uma grande sorte e ganhou + ${porcentagem}% do seu saldo atual`; 
    }
  }
}
