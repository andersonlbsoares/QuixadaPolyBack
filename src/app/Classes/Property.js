import Tile from "./Tile.js";

export default class Property extends Tile {
    price;
    rent;
    houses;
    hotel;
    owner;
  constructor(name, price, row, column) {
    super(name, row, column, "Você caiu em " + name);
    this.price = price;
    this.rent = price * 0.15;
    this.houses = 0;
    this.hotel = false;
    this.owner = null;
  }

  setOwner(player) {
    this.owner = player;
  }

  payRent(player) {
    if (this.owner && this.owner !== player) {
      if (this.hotel) {
        console.log(`${player.name} pagou $${this.rent * 2} de aluguel para ${this.owner.name}`);
        player.balance -= this.rent * 2;
        this.owner.balance += this.rent * 2;
      }else{
        let value = this.rent;
        if (this.houses > 0) {
          value = this.rent * this.houses;
      }
      console.log(
        `${player.name} pagou $${value} de aluguel para ${this.owner.name}`
      );
      player.balance -= value;
      this.owner.balance += value;
    }
  }
  }

  onLand(player) {
    super.onLand(player);
    if (this.owner === null && player.balance >= this.price) {
      return `${player.name} pode comprar ${this.name} por $${this.price}`
    } else if(this.owner === null && player.balance < this.price){
      return `${player.name} não tem dinheiro suficiente para comprar ${this.name}`
    }else if (this.owner !== player) {
      this.payRent(player);
      return `${player.name} pagou aluguel para ${this.owner.name}`
    } else {
      return `${player.name} já é dono de ${this.name}`
    }
  }

  buildHouse() {
    if (this.houses < 4) {
      this.houses++;
      this.rent = this.rent + 0.1 * this.price;
      this.price = this.price + 0.1 * this.price;
      console.log(`Construída uma casa em ${this.name}`);
    } else {
      this.hotel = true;
      this.rent = this.rent + 0.5 * this.price;
      this.price = this.price + 0.5 * this.price;
      console.log(`Construído um hotel em ${this.name}`);
    }
  }
}
