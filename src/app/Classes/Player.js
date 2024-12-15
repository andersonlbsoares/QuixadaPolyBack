export default class Player {
	color;
	name;
	position;
	balance;
	constructor(name, color) {
		this.color = color;
		this.name = name;
		this.position = 0;
		this.balance = 1500;
	}

	move(steps) {
		this.position = (this.position + steps) % 40;
	}
}
