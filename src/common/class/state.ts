import { LS } from "../../globaux/ls";
import { Leek } from "./entity/leek";

export class State {
	me: Leek;
	enemy: Leek;

	constructor(me: Leek, enemy: Leek) {
		this.me = me;
		this.enemy = enemy;
	}

	static aliveLeeks() {
		return LS.arrayMap(
			LS.arrayFilter(LS.getAliveEnemies(), e => LS.getType(e) == LS.ENTITY_LEEK), 
			id => new Leek(id)
		);
	}
}