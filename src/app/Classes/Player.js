export default class Player {
	color;
	name;
	position;
	balance;
	isInJail;
	constructor(name, color) {
		this.color = color;
		this.name = name;
		this.position = 0;
		this.balance = 1500;
		this.isInJail = false;
	}

	move(steps) {
		this.position = (this.position + steps) % 40;
	}

	changeInJailStatus() {
		this.isInJail = !this.isInJail;
	}
}
