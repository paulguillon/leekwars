import { AoeType, Stat, WeaponType } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { enemy, field, myLeek } from "../vars";
import { Cell } from "./cell";
import { findFirst } from "../utils";
import { weapons } from "../data/weapons";
import { Leek } from "./leek";
import { Damage } from "./damage";

export class Weapon {
	id: number;
	name: string;
	types: WeaponType[];
	cost: number;
	minValues: number[];
	maxValues: number[];
	sourceStat: Stat[];
	targetStat: Stat[];
	duration: number;
	stackable: boolean;
	minRange: number;
	maxRange: number;
	launchType: AoeType;
	aoeType: AoeType;
	aoeSize: number;

	constructor(id: number, name: string, types: WeaponType[], cost: number, minValues: number[], maxValues: number[], sourceStat: Stat[], targetStat: Stat[], duration: number, stackable: boolean, minRange: number, maxRange: number, launchType: AoeType, aoeType: AoeType, aoeSize: number) {
		this.id = id;
		this.name = name;
		this.types = types;
		this.cost = cost;
		this.minValues = minValues;
		this.maxValues = maxValues;
		this.sourceStat = sourceStat;
		this.targetStat = targetStat;
		this.duration = duration;
		this.stackable = stackable;
		this.minRange = minRange;
		this.maxRange = maxRange;
		this.launchType = launchType;
		this.aoeType = aoeType;
		this.aoeSize = aoeSize;
	}

	canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
		const casterCell: Cell = field[LS.getCell(caster)];
		const targetCellNumber: number = LS.getCell(target);

		if (LS.canUseChip(this.id, target)) return casterCell;

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

	static getTargetWeapons(targetId: number): Weapon[] {
		return LS.arrayMap(LS.getWeapons(targetId), (weaponId: number) => weapons[weaponId]);
	}

	static hasWeaponEquipped(target: Leek, weaponId: number): boolean {
		return !!findFirst(LS.getWeapons(target.id), (id: number) => id == weaponId);
	}

	hasWeaponType(weaponType: WeaponType): boolean {
		return LS.inArray(this.types, weaponType);
	}

	isCurrentlyEquippedOn(holder: Leek): boolean {
		return LS.getWeapon(holder.id) == this.id;
	}

	weaponTypePosition(weaponType: WeaponType): number {
		return LS.search(this.types, weaponType);
	}

	/**
	 * Calcul les dégats de l'arme
	 * @param source Tireur
	 * @param target Cible
	 * @returns Dégats de l'arme
	 */
	getWeaponDamage(source: number = myLeek.id, target: number = enemy.id) {
		const strength: number = this.weaponTypePosition(WeaponType.STRENGTH);
		const poison: number = this.weaponTypePosition(WeaponType.POISON);
		const nova: number = this.weaponTypePosition(WeaponType.NOVA);

		let damage: Damage = new Damage();

		if (strength > -1) {
			const formula: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target);
			damage.strengthMin = LS.round(this.minValues[strength] * formula);
			damage.strengthMax = LS.round(this.maxValues[strength] * formula);
			damage.strengthAvg = (damage.strengthMin + damage.strengthMax) / 2;
			damage.strengthMinByTP = this.minValues[strength] / this.cost;
			damage.strengthMaxByTP = this.maxValues[strength] / this.cost;
			damage.strengthAvgByTP = (this.minValues[strength] + this.maxValues[strength]) / 2 / this.cost;
		}
		if (poison > -1) {
			const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
			damage.poisonMin = LS.round(this.minValues[poison] * formula);
			damage.poisonMax = LS.round(this.maxValues[poison] * formula);
			damage.poisonAvg = (damage.poisonMin + damage.poisonMax) / 2;
			damage.poisonMinByTP = this.minValues[poison] / this.cost;
			damage.poisonMaxByTP = this.maxValues[poison] / this.cost;
			damage.poisonAvgByTP = (this.minValues[poison] + this.maxValues[poison]) / 2 / this.cost;
		}
		if (nova > -1) {
			const formula: Function = (value: number) => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
			damage.novaMin = LS.round(formula(this.minValues[nova]));
			damage.novaMax = LS.round(formula(this.maxValues[nova]));
			damage.novaAvg = (damage.novaMin + damage.novaMax) / 2;
			damage.novaMinByTP = this.minValues[nova] / this.cost;
			damage.novaMaxByTP = this.maxValues[nova] / this.cost;
			damage.novaAvgByTP = (this.minValues[nova] + this.maxValues[nova]) / 2 / this.cost;
		}

		damage.totalMin = damage.strengthMin + damage.poisonMin;
		damage.totalMax = damage.strengthMax + damage.poisonMax;
		damage.totalAvg = damage.strengthAvg + damage.poisonAvg;
		damage.totalMinByTP = damage.strengthMinByTP + damage.poisonMinByTP;
		damage.totalMaxByTP = damage.strengthMaxByTP + damage.poisonMaxByTP;
		damage.totalAvgByTP = damage.strengthAvgByTP + damage.poisonAvgByTP;

		return damage;
	}
}