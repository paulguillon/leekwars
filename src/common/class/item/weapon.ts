import { AoeType, Type } from "../../../globaux/enums";
import { LS } from "../../../globaux/ls";
import { enemy, field, myLeek } from "../../vars";
import { Cell } from "../cell";
import { findFirst } from "../../utils";
import { weapons } from "../../data/weapons";
import { Leek } from "../entity/leek";
import { ItemEffect } from "./itemEffect";
import { Item } from "./item";
import { areaToAoeSize, areaToAoeType, launchTypeToAoeType } from "../../mapping";

export class Weapon extends Item{
	passive: ItemEffect[];
	item: number;

	constructor(id: number, level: number, template: number, item: number) {
		super(
			id, 
			LS.getWeaponName(id), 
			level, 
			LS.getWeaponMinRange(id), 
			LS.getWeaponMaxRange(id), 
			launchTypeToAoeType(LS.getWeaponLaunchType(id)), 
			LS.arrayMap(LS.getWeaponEffects(id), (itemEffect: number[]) => new ItemEffect(itemEffect)), 
			LS.getWeaponCost(id),
            areaToAoeType(LS.getWeaponArea(id)), 
            areaToAoeSize(LS.getWeaponArea(id)), 
            LS.weaponNeedLos(id), 
            template
		);
		this.passive = LS.arrayMap(LS.getWeaponPassiveEffects(id), (passive: number[]) => new ItemEffect(passive));
		this.item = item;
	}

	static getById(weaponId: number) {
		return findFirst(weapons, weapon => weapon.id == weaponId);
	}

	use(caster: number = myLeek.id, target: number = enemy.id) {
		if (LS.canUseWeapon(this.id, target)) {
			LS.useWeapon(target);
		}
	}

	moveAndUse(caster: number = myLeek.id, target: number = enemy.id) {
		const cell: Cell | null = this.canMoveToUse(caster, target);

		if (cell && LS.canUseWeapon(this.id, target)) {
			LS.useWeaponOnCell(cell.number);
		}
	}

	canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
		const casterCell: Cell = field[LS.getCell(caster)];
		const targetCellNumber: number = LS.getCell(target);

		if (LS.canUseWeapon(this.id, target)) return casterCell;

		const cellsToGo: Cell[] = Cell.getCellsByArea(casterCell, AoeType.CIRCLE, 0, LS.getMP(caster), true);

		let cellsToHitTarget = new Map<number, Cell>();

		for (const cell of cellsToGo) {
			const launchCells: Cell[] = Cell.getCellsByArea(cell, this.launchType, this.minRange, this.maxRange);

			const visibleLaunchCells: Cell[] = Cell.visibleCells(launchCells, targetCellNumber);

			// If target is in launch range
			const response = findFirst(visibleLaunchCells, (cell: Cell) => cell.number == targetCellNumber);
			if (response) return response;

			let cells: Cell[] = LS.arrayFilter(visibleLaunchCells, cell => {
				const aoeCells: Cell[] = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
				return LS.inArray(aoeCells, field[targetCellNumber]);
			});

			LS.arrayIter(cells, (cell: Cell) => LS.mapPut(cellsToHitTarget, LS.getCellDistance(LS.getCell(caster), LS.getCell(cell.number)), cell));
		}

		if (!LS.count(LS.mapKeys(cellsToHitTarget))) return null;

		return LS.mapGet(cellsToHitTarget, LS.arraySort(LS.mapKeys(cellsToHitTarget), (a, b) => a - b)[0]);
	}

	canMoveToUseOnCell(cell: Cell, caster: number = myLeek.id): Cell | null {
		if (LS.canUseChipOnCell(this.id, cell.number)) return field[LS.getCell(caster)];

		const cellsToGo: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], AoeType.CIRCLE, 0, LS.getMP(caster), true);

		const cells: Cell[] = Cell.visibleCells(cellsToGo, cell.number);

		return Cell.getClosestCellPathTo(cells, myLeek.id);
	}

	static hasWeaponEquipped(target: Leek, weaponId: number): boolean {
		return !!findFirst(LS.getWeapons(target.id), (id: number) => id == weaponId);
	}

	hasWeaponEffect(searchedType: Type): boolean {
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
			if (effect.type === LS.EFFECT_DAMAGE) {
				const multiplier: number = (source.strength() / 100 + 1) * (source.power() / 100 + 1)
				const relative: number = (1 - target.relative() / 100);
				const absolute: number = target.absolute();
				const calculateDmg: Function = (base) => LS.round(base * multiplier * relative - absolute);
				
				this.damage.strengthMin = calculateDmg(effect.min);
				this.damage.strengthMax = calculateDmg(effect.max);
				this.damage.strengthAvg = (this.damage.strengthMin + this.damage.strengthMax) / 2;
				this.damage.strengthMinByTP = effect.min / this.cost;
				this.damage.strengthMaxByTP = effect.max / this.cost;
				this.damage.strengthAvgByTP = (effect.min + effect.max) / 2 / this.cost;
			} else if (effect.type === LS.EFFECT_POISON) {
				const formula: number = (source.magic() / 100 + 1) * (source.power() / 100 + 1);
				this.damage.poisonMin = LS.round(effect.min * formula);
				this.damage.poisonMax = LS.round(effect.max * formula);
				this.damage.poisonAvg = (this.damage.poisonMin + this.damage.poisonMax) / 2;
				this.damage.poisonMinByTP = effect.min / this.cost;
				this.damage.poisonMaxByTP = effect.max / this.cost;
				this.damage.poisonAvgByTP = (effect.min + effect.max) / 2 / this.cost;
			} else if (effect.type === LS.EFFECT_NOVA_DAMAGE) {
				const formula: Function = (value: number) => LS.min(target.totalLife() - target.life(), value * (source.science() / 100 + 1) * (source.power() / 100 + 1));
				this.damage.novaMin = LS.round(formula(effect.min));
				this.damage.novaMax = LS.round(formula(effect.max));
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