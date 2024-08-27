import { EFFECT_HEAL, EFFECT_POISON, arrayEvery, arrayFilter, arrayMap, arraySome, debug, getEffects, getLife, sum } from "transpiler-ls";
import { findFirst } from "../utils";
import { Chip } from "./item/chip";
import { Weapon } from "./item/weapon";

export class Effect {
	type: number;
	value: number;
	caster: number;
	turns: number;
	critical: boolean;
	item: Chip | Weapon;
	target: number;
	modifiers: number;

	constructor(effect) {
		this.type = effect[0];
		this.value = effect[1];
		this.caster = effect[2];
		this.turns = effect[3];
		this.critical = effect[4];
		this.item = effect[5];
		this.target = effect[6];
		this.modifiers = effect[7];
	}

	static getAllEffects(entity: number) {
		return arrayMap(getEffects(entity), effect => new Effect(effect));
	}

	static getEffectOfType(target: number, searchedEffect: number) {
		return findFirst(Effect.getAllEffects(target), effect => effect.type == searchedEffect);
	}

	static getEffectsOfType(target: number, searchedEffect: number, minTurnValue: number = 1) {
		return arrayFilter(Effect.getAllEffects(target), effect => effect.type == searchedEffect && effect.turns >= minTurnValue);
	}

	static getEffectsOfTypeAmount(target: number, searchedEffect: number, minTurnValue: number = 1) {
		debug("Total d'armure fixe à plus d'un tour : " + sum(arrayMap(Effect.getEffectsOfType(target, searchedEffect, minTurnValue), effect => effect.value)))
		return sum(arrayMap(Effect.getEffectsOfType(target, searchedEffect, minTurnValue), effect => effect.value));
	}

	static hasEffect(entity: number, searchedEffect: number) {
		return arraySome(Effect.getAllEffects(entity), effect => effect.type == searchedEffect);
	}

	static hasEffects(entity: number, searchedEffects: number[]) {
		const entityEffects: Effect[] = Effect.getAllEffects(entity);
		return arrayEvery(searchedEffects, (searchedEffect: number) => !!findFirst(entityEffects, (effect: Effect) => effect.type === searchedEffect));
	}

	static isDeadByPoison(target: number) {
		let targetLife: number = getLife();
		for (const effect of Effect.getAllEffects(target)) {
			if (effect.type == EFFECT_POISON) {
				targetLife -= effect.value;
			} else if (effect.type == EFFECT_HEAL) {
				targetLife += effect.value;
			}
			if (targetLife <= 0) return true;
		}
		return false;
	}
}