export default class Player {
	color;
	name;
	position;
	balance;
	isInJail;
	status;
	turnsInJail;
	isBankrupt;

	constructor(name, color) {
		this.color = color;
		this.name = name;
		this.position = 0;
		this.balance = 1500;
		this.isInJail = false;
		this.status = "not your turn";
		this.turnsInJail = 0;
		this.isBankrupt = false;
	}

	move(steps) {
		this.position = (this.position + steps) % 40;
	}

	changeInJailStatus() {
		this.isInJail = !this.isInJail;
	}

	payRent(value) {
		this.balance -= value;
	}

	setJailStatus(status) {
		this.isInJail = status;
	}

	setBankruptStatus(status) {
		this.isBankrupt = status;
	}

}
