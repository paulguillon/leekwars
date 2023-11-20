import { Leek } from "./leek";

export class State {
	me: Leek;
	enemy: Leek;

	constructor(me: Leek, enemy: Leek) {
		this.me = me;
		this.enemy = enemy;
	}
}