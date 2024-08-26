import { AoeType } from "../../../globaux/enums";
import { EFFECT_DAMAGE, EFFECT_NOVA_DAMAGE, EFFECT_POISON, arrayFilter, arrayIter, arrayMap, arraySort, canUseChipOnCell, canUseWeapon, count, getCell, getCellDistance, getMP, getWeaponArea, getWeaponCost, getWeaponEffects, getWeaponLaunchType, getWeaponMaxRange, getWeaponMinRange, getWeaponName, getWeaponPassiveEffects, getWeapons, inArray, mapGet, mapKeys, mapPut, min, round, useWeapon, useWeaponOnCell, weaponNeedLos } from "../../../ressources/ls";
import { enemy, field, myLeek } from "../../vars";
import { Cell } from "../cell";
import { findFirst } from "../../utils";
import { weapons } from "../../data/weapons";
import { Leek } from "../entity/leek";
import { ItemEffect } from "./itemEffect";
import { Item } from "./item";

export class Weapon extends Item{
	passive: ItemEffect[];
	item: number;

	constructor(id: number, level: number, template: number, item: number) {
		super(
			id, 
			getWeaponName(id), 
			level, 
			getWeaponMinRange(id), 
			getWeaponMaxRange(id), 
			getWeaponLaunchType(id), 
			arrayMap(getWeaponEffects(id), (itemEffect: number[]) => new ItemEffect(itemEffect)), 
			getWeaponCost(id),
            getWeaponArea(id),
            weaponNeedLos(id), 
            template
		);
		this.passive = arrayMap(getWeaponPassiveEffects(id), (passive: number[]) => new ItemEffect(passive));
		this.item = item;
	}

	static getById(weaponId: number) {
		return findFirst(weapons, weapon => weapon.id == weaponId);
	}

	use(caster: number = myLeek.id, target: number = enemy.id) {
		if (canUseWeapon(this.id, target)) {
			useWeapon(target);
		}
	}

	moveAndUse(caster: number = myLeek.id, target: number = enemy.id) {
		const cell: Cell | null = this.canMoveToUse(caster, target);

		if (cell && canUseWeapon(this.id, target)) {
			useWeaponOnCell(cell.number);
		}
	}

	canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
		const casterCell: Cell = field[getCell(caster)];
		const targetCellNumber: number = getCell(target);

		if (canUseWeapon(this.id, target)) return casterCell;

		const cellsToGo: Cell[] = Cell.getCellsByArea(casterCell, AoeType.CIRCLE, 0, getMP(caster), true);

		let cellsToHitTarget = new Map<number, Cell>();

		for (const cell of cellsToGo) {
			const launchCells: Cell[] = Cell.getCellsByArea(cell, this.launchType, this.minRange, this.maxRange);

			const visibleLaunchCells: Cell[] = Cell.visibleCells(launchCells, targetCellNumber);

			// If target is in launch range
			const response = findFirst(visibleLaunchCells, (cell: Cell) => cell.number == targetCellNumber);
			if (response) return response;

			let cells: Cell[] = arrayFilter(visibleLaunchCells, cell => {
				const aoeCells: Cell[] = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
				return inArray(aoeCells, field[targetCellNumber]);
			});

			arrayIter(cells, (cell: Cell) => mapPut(cellsToHitTarget, getCellDistance(getCell(caster), getCell(cell.number)), cell));
		}

		if (!count(mapKeys(cellsToHitTarget))) return null;

		return mapGet(cellsToHitTarget, arraySort(mapKeys(cellsToHitTarget), (a, b) => a - b)[0]);
	}

	canMoveToUseOnCell(cell: Cell, caster: number = myLeek.id): Cell | null {
		if (canUseChipOnCell(this.id, cell.number)) return field[getCell(caster)];

		const cellsToGo: Cell[] = Cell.getCellsByArea(field[getCell(caster)], AoeType.CIRCLE, 0, getMP(caster), true);

		const cells: Cell[] = Cell.visibleCells(cellsToGo, cell.number);

		return Cell.getClosestCellPathTo(cells, myLeek.id);
	}

	static hasWeaponEquipped(target: Leek, weaponId: number): boolean {
		return !!findFirst(getWeapons(target.id), (id: number) => id == weaponId);
	}

	hasWeaponEffect(searchedType: number): boolean {
		return !!findFirst(this.itemEffects, itemEffect => itemEffect.type == searchedType);
	}

	/**
	 * Calcul les dégats de l'arme
	 * @param source Tireur
	 * @param target Cible
	 * @returns Dégats de l'arme
	 */
	getWeaponDamage(source: Leek = myLeek, target: Leek = enemy) {
		
		for (const effect of this.itemEffects) {
			if (effect.type === EFFECT_DAMAGE) {
				const multiplier: number = (source.strength() / 100 + 1) * (source.power() / 100 + 1)
				const relative: number = (1 - target.relative() / 100);
				const absolute: number = target.absolute();
				const calculateDmg: Function = (base) => round(base * multiplier * relative - absolute);
				
				this.damage.strengthMin = calculateDmg(effect.min);
				this.damage.strengthMax = calculateDmg(effect.max);
				this.damage.strengthAvg = (this.damage.strengthMin + this.damage.strengthMax) / 2;
				this.damage.strengthMinByTP = effect.min / this.cost;
				this.damage.strengthMaxByTP = effect.max / this.cost;
				this.damage.strengthAvgByTP = (effect.min + effect.max) / 2 / this.cost;
			} else if (effect.type === EFFECT_POISON) {
				const formula: number = (source.magic() / 100 + 1) * (source.power() / 100 + 1);
				this.damage.poisonMin = round(effect.min * formula);
				this.damage.poisonMax = round(effect.max * formula);
				this.damage.poisonAvg = (this.damage.poisonMin + this.damage.poisonMax) / 2;
				this.damage.poisonMinByTP = effect.min / this.cost;
				this.damage.poisonMaxByTP = effect.max / this.cost;
				this.damage.poisonAvgByTP = (effect.min + effect.max) / 2 / this.cost;
			} else if (effect.type === EFFECT_NOVA_DAMAGE) {
				const formula: Function = (value: number) => min(target.totalLife() - target.life(), value * (source.science() / 100 + 1) * (source.power() / 100 + 1));
				this.damage.novaMin = round(formula(effect.min));
				this.damage.novaMax = round(formula(effect.max));
				this.damage.novaAvg = (this.damage.novaMin + this.damage.novaMax) / 2;
				this.damage.novaMinByTP = effect.min / this.cost;
				this.damage.novaMaxByTP = effect.max / this.cost;
				this.damage.novaAvgByTP = (effect.min + effect.max) / 2 / this.cost;
			}
		}

		this.damage.totalMin = this.damage.strengthMin + this.damage.poisonMin;
		this.damage.totalMax = this.damage.strengthMax + this.damage.poisonMax;
		this.damage.totalAvg = this.damage.strengthAvg + this.damage.poisonAvg;
		this.damage.totalMinByTP = this.damage.strengthMinByTP + this.damage.poisonMinByTP;
		this.damage.totalMaxByTP = this.damage.strengthMaxByTP + this.damage.poisonMaxByTP;
		this.damage.totalAvgByTP = this.damage.strengthAvgByTP + this.damage.poisonAvgByTP;

		return this.damage;
	}

	string() {
		return this.name;
	}
}