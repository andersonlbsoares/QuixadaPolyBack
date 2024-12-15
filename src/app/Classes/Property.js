import Tile from "./Tile.js";

export default class Property extends Tile {
  constructor(name, price) {
    super(name);
    this.price = price;
    this.rent = price * 0.15;
    this.houses = 0;
    this.hotels = 0;
    this.owner = null;
  }

  setOwner(player) {
    this.owner = player;
  }

  payRent(player) {
    if (this.owner && this.owner !== player) {
      const value = this.rent * (1 + this.houses * 0.1 + this.hotels * 0.2);
      console.log(
        `${player.name} pagou $${value} de aluguel para ${this.owner.name}`
      );
      player.balance -= value;
      this.owner.balance += value;
    }
  }

  onLand(player) {
    super.onLand(player);
    if (this.owner === null) {
      console.log(
        `${player.name} pode comprar ${this.name} por $${this.price}`
      );
    } else if (this.owner !== player) {
      this.payRent(player);
    } else {
      console.log(`${player.name} já é dono de ${this.name}`);
    }
  }
}
