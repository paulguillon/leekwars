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
	damage: Damage;

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
		this.damage = new Damage();
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

	/**
	 * Calcul les dégats de l'arme
	 * @param source Tireur
	 * @param target Cible
	 * @returns Dégats de l'arme
	 */
	getWeaponDamage(source: number = myLeek.id, target: number = enemy.id) {
		const strength: number = LS.search(this.types, WeaponType.STRENGTH);
		const poison: number = LS.search(this.types, WeaponType.POISON);
		const nova: number = LS.search(this.types, WeaponType.NOVA);

		if (strength > -1) {
			const multiplier: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1)
			const relative: number = (1 - LS.getRelativeShield(target) / 100);
			const absolute: number = LS.getAbsoluteShield(target);
			const calculateDmg: Function = (base) => LS.round(base * multiplier * relative - absolute);
			
			this.damage.strengthMin = calculateDmg(this.minValues[strength]);
			this.damage.strengthMax = calculateDmg(this.maxValues[strength]);
			this.damage.strengthAvg = (this.damage.strengthMin + this.damage.strengthMax) / 2;
			this.damage.strengthMinByTP = this.minValues[strength] / this.cost;
			this.damage.strengthMaxByTP = this.maxValues[strength] / this.cost;
			this.damage.strengthAvgByTP = (this.minValues[strength] + this.maxValues[strength]) / 2 / this.cost;
		}
		if (poison > -1) {
			const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
			this.damage.poisonMin = LS.round(this.minValues[poison] * formula);
			this.damage.poisonMax = LS.round(this.maxValues[poison] * formula);
			this.damage.poisonAvg = (this.damage.poisonMin + this.damage.poisonMax) / 2;
			this.damage.poisonMinByTP = this.minValues[poison] / this.cost;
			this.damage.poisonMaxByTP = this.maxValues[poison] / this.cost;
			this.damage.poisonAvgByTP = (this.minValues[poison] + this.maxValues[poison]) / 2 / this.cost;
		}
		if (nova > -1) {
			const formula: Function = (value: number) => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
			this.damage.novaMin = LS.round(formula(this.minValues[nova]));
			this.damage.novaMax = LS.round(formula(this.maxValues[nova]));
			this.damage.novaAvg = (this.damage.novaMin + this.damage.novaMax) / 2;
			this.damage.novaMinByTP = this.minValues[nova] / this.cost;
			this.damage.novaMaxByTP = this.maxValues[nova] / this.cost;
			this.damage.novaAvgByTP = (this.minValues[nova] + this.maxValues[nova]) / 2 / this.cost;
		}

		this.damage.totalMin = this.damage.strengthMin + this.damage.poisonMin;
		this.damage.totalMax = this.damage.strengthMax + this.damage.poisonMax;
		this.damage.totalAvg = this.damage.strengthAvg + this.damage.poisonAvg;
		this.damage.totalMinByTP = this.damage.strengthMinByTP + this.damage.poisonMinByTP;
		this.damage.totalMaxByTP = this.damage.strengthMaxByTP + this.damage.poisonMaxByTP;
		this.damage.totalAvgByTP = this.damage.strengthAvgByTP + this.damage.poisonAvgByTP;

		return this.damage;
	}
}