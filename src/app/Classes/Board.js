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
    this.tiles.push(new Property("Lion Square", 600));
    this.tiles.push(new BadLuckTile());
    this.tiles.push(new Property("Praça da Estação", 600));
    this.tiles.push(new TaxTile());
    this.tiles.push(new Property("RU", 1000));
    this.tiles.push(new Property("China Brasil", 100));
    this.tiles.push(new LuckTile());
    this.tiles.push(new Property("Mac Lanches", 100));
    this.tiles.push(new Property("Q-Pão", 1200));
    this.tiles.push(new JailTile());
    this.tiles.push(new Property("Imperius Fitness", 1400));
    this.tiles.push(new Property("Auditório - UFC", 14000));
    this.tiles.push(new Property("Zaut Fitness", 1400));
    this.tiles.push(new Property("Complexo One", 1600));
    this.tiles.push(new Property("Supermercado Pinheiro", 1800));
    this.tiles.push(new LuckTile());
    this.tiles.push(new Property("Supermercado Nosso Atacarejo", 2000));
    this.tiles.push(new BadLuckTile());
    this.tiles.push(new Property("Ginásio Rinaldo Róger", 2200));
    this.tiles.push(new ParkingTile());
    this.tiles.push(new Property("Pé na aréia", 2400));
    this.tiles.push(new LuckTile());
    this.tiles.push(new Property("UFC Campus Quixadá", 2600));
    this.tiles.push(new Property("IFCE Quixadá", 2600));
    this.tiles.push(new Property("Biblioteca - UFC", 26000));
    this.tiles.push(new Property("UECE Quixadá", 2800));
    this.tiles.push(new BadLuckTile());
    this.tiles.push(new Property("Igreja Matriz", 3000));
    this.tiles.push(new Property("Chalé da Pedra", 3000));
    this.tiles.push(new GoToJailTile());
    this.tiles.push(new Property("Mercado Central", 3200));
    this.tiles.push(new Property("Pedra do Cruzeiro", 3500));
    this.tiles.push(new Property("Sala do CA", 35000));
    this.tiles.push(new Property("Pedra da Galinha Choca", 3500));
    this.tiles.push(new LuckTile());
    this.tiles.push(new TaxTile());
    this.tiles.push(new Property("Rainha do Sertão", 4000));
    this.tiles.push(new BadLuckTile());
    this.tiles.push(new TaxTile());
  }

  getTile(position) {
    return this.tiles[position];
  }
}
