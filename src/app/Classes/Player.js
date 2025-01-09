export default class Player {
	color;
	name;
	position;
	balance;
	isInJail;
	status;
	constructor(name, color) {
		this.color = color;
		this.name = name;
		this.position = 0;
		this.balance = 1500;
		this.isInJail = false;
		this.status = "not your turn";
	}

	move(steps) {
		this.position = (this.position + steps) % 40;
	}

	changeInJailStatus() {
		this.isInJail = !this.isInJail;
	}
}
