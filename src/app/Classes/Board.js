import StartTile from "./StartTile.js";
import Property from "./Property.js";
import JailTile from "./JailTile.js";
import GoToJailTile from "./GoToJailTile.js";
import ParkingTile from "./ParkingTile.js";
import BadLuckTile from "./BadLuckTile.js";
import LuckTile from "./LuckTile.js";
import TaxTile from "./TaxTile.js";

export default class Board {
  constructor() {
    this.tiles = [];
    this.setupTiles();
  }

  setupTiles() {
    this.tiles.push(new StartTile());
    this.tiles.push(new Property("Lion Square", 300, 11, 10));
    this.tiles.push(new BadLuckTile("Má Sorte 1", 11, 9));
    this.tiles.push(new Property("Praça da Estação", 300, 11, 8));
    this.tiles.push(new TaxTile("Imposto 1", 11, 7));
    this.tiles.push(new Property("RU", 500, 11, 6));
    this.tiles.push(new Property("China Brasil", 100, 11, 5));
    this.tiles.push(new LuckTile("Sorte 1", 11, 4));
    this.tiles.push(new Property("Mac Lanches", 100, 11, 3));
    this.tiles.push(new Property("Q-Pão", 1200, 11, 2));
    this.tiles.push(new JailTile());
    this.tiles.push(new Property("Imperius Fitness", 700, 10, 1));
    this.tiles.push(new Property("Auditório - UFC", 1000, 9 ,1));
    this.tiles.push(new Property("Zaut Fitness", 700, 8, 1));
    this.tiles.push(new Property("Complexo One", 900, 7, 1 ));
    this.tiles.push(new Property("Supermercado Pinheiro", 800, 6, 1));
    this.tiles.push(new LuckTile("Sorte 2", 5, 1));
    this.tiles.push(new Property("Supermercado Nosso Atacarejo", 700, 4, 1));
    this.tiles.push(new BadLuckTile("Má Sorte 2", 3, 1));
    this.tiles.push(new Property("Ginásio Rinaldo Róger", 1000, 2, 1));
    this.tiles.push(new ParkingTile());
    this.tiles.push(new Property("Pé na aréia", 1200, 1, 2));
    this.tiles.push(new LuckTile("Sorte 3", 1, 3));
    this.tiles.push(new Property("UFC Campus Quixadá", 1300, 1, 4));
    this.tiles.push(new Property("IFCE Quixadá", 1300, 1, 5));
    this.tiles.push(new Property("Biblioteca - UFC", 1300, 1, 6));
    this.tiles.push(new Property("UECE Quixadá", 1400, 1, 7));
    this.tiles.push(new BadLuckTile("Má Sorte 3", 1, 8));
    this.tiles.push(new Property("Igreja Matriz", 1500, 1, 9));
    this.tiles.push(new Property("Chalé da Pedra", 1500, 1, 10));
    this.tiles.push(new GoToJailTile());
    this.tiles.push(new Property("Mercado Central", 1600, 2, 11));
    this.tiles.push(new Property("Pedra do Cruzeiro", 1700, 3, 11));
    this.tiles.push(new Property("Sala do CA", 35000, 4, 11));
    this.tiles.push(new Property("Pedra da Galinha Choca", 1700, 5, 11));
    this.tiles.push(new LuckTile("Sorte 4", 6, 11));
    this.tiles.push(new TaxTile("Imposto 2", 7, 11));
    this.tiles.push(new Property("Rainha do Sertão", 2000, 8, 11));
    this.tiles.push(new BadLuckTile("Má Sorte 4", 9, 11));
    this.tiles.push(new TaxTile("Imposto 3", 10, 11));
  }

  getTile(position) {
    return this.tiles[position];
  }
}
