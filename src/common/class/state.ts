import { ENTITY_LEEK, arrayFilter, arrayMap, getAliveEnemies, getType } from "../../ressources/ls";
import { Leek } from "./entity/leek";

export class State {
	me: Leek;
	enemy: Leek;

	constructor(me: Leek, enemy: Leek) {
		this.me = me;
		this.enemy = enemy;
	}

	static aliveLeeks() {
		return arrayMap(
			arrayFilter(getAliveEnemies(), e => getType(e) == ENTITY_LEEK), 
			id => new Leek(id)
		);
	}
}