export class Effect {
	type: number;
	value: number;
	caster: number;
	turns: number;
	critical: boolean;
	item: Chip | Weapon;
	target: number;
	modifiers: number;
	
	constructor (effect) {
		this.type = effect[0];
		this.value = effect[1];
		this.caster = effect[2];
		this.turns = effect[3];
		this.critical = effect[4];
		this.item = effect[5];
		this.target = effect[6];
		this.modifiers = effect[7];
	}

	static getAllEffects(number entity) {
		return LS.arrayMap(LS.getEffects(entity), effect => new Effect(effect))
	}

	static getEffectOfType(number target, number searchedEffect) {
		return findFirst(Effect.getAllEffects(target), effect => effect.type == searchedEffect);
	}

	static getEffectsOfType(number target, number searchedEffect, number minTurnValue = 1) {
		return LS.arrayFilter(Effect.getAllEffects(target), effect => effect.type == searchedEffect && effect.turns >= minTurnValue);
	}

	static getEffectsOfTypeAmount(number target, number searchedEffect, number minTurnValue = 1) {
		return LS.sum(LS.arrayMap(Effect.getEffectsOfType(target, searchedEffect, minTurnValue), effect => effect.value));
	}

	static hasEffect(number entity, number searchedEffect) {
		return LS.arraySome(Effect.getAllEffects(entity), effect => effect.type == searchedEffect);
	}

	static hasEffects(number entity, Array<number> effects) {
		var entityEffects = Effect.getAllEffects(entity);
		for (var effect in effects) {
			if(!LS.search(entityEffects, (e) => e.type = effect)) return false;
		}
		return true;
	}
	
	static isDeadByPoison(number target) {
		var targetLife = LS.getLife();
		for (var effect in Effect.getAllEffects(target)) {
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