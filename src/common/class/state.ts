import { LS } from "../../globaux/ls";
import { Leek } from "./entity/leek";

export class State {
	me: Leek;
	enemy: Leek;

	constructor(me: Leek, enemy: Leek) {
		this.me = me;
		this.enemy = enemy;
	}

	aliveLeeks() {
		return LS.arrayMap(LS.getAliveEnemies(), id => new Leek(id));
	}
}