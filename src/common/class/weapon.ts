import {AoeType, Stat, WeaponType} from "../../globaux/enums";
import {LS} from "../../globaux/ls";
import {enemy, field, myLeek} from "../vars";
import { Cell } from "./cell";
import {findFirst} from "../utils";
import {weapons} from "../data/weapons";
import {Leek} from "./leek";

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
	
	constructor(obj) {
		this.id = obj.id;
		this.name = obj.name;
		this.types = obj.types;
		this.cost = obj.cost;
		this.minValues = obj.minValues;
		this.maxValues = obj.maxValues;
		this.sourceStat = obj.sourceStat;
		this.targetStat = obj.targetStat;
		this.duration = obj.duration;
		this.stackable = obj.stackable;
		this.minRange = obj.minRange;
		this.maxRange = obj.maxRange;
		this.launchType = obj.launchType;
		this.aoeType = obj.aoeType;
		this.aoeSize = obj.aoeSize;
	}
	
	 canMoveToUse(caster: number = myLeek.id, target: number = enemy.id): Cell | undefined {
		const casterCell: Cell = field[LS.getCell(caster)];
		const targetCellNumber: number = LS.getCell(target);
		
		if(LS.canUseChip(this.id, target)) return casterCell;
		
		const cellsToGo: Cell[] = Cell.getCellsByArea(casterCell, AoeType.CIRCLE, 0, LS.getMP(caster), true);

		let cellsToHitTarget: Map<number, Cell> = new Map<number, Cell>();
		
		for (const cell of cellsToGo) {
			const launchCells: Cell[] = Cell.getCellsByArea(cell, this.launchType, this.minRange, this.maxRange);

			const visibleLaunchCells: Cell[] = Cell.visibleCells(launchCells, targetCellNumber);

			// If target is in launch range
			const response: Cell | undefined = findFirst(visibleLaunchCells, (cell: Cell) => cell.number == targetCellNumber);
			if (response) return response;

			let cells: Cell[] = LS.arrayFilter(visibleLaunchCells, cell => {
				const aoeCells: Cell[] = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
				return LS.inArray(aoeCells, field[targetCellNumber]);
			});
			
			LS.arrayIter(cells, (cell: Cell) => LS.mapPut(cellsToHitTarget, LS.getCellDistance(LS.getCell(caster), LS.getCell(cell.number)), cell));
		}
		
		if(!LS.count(LS.mapKeys(cellsToHitTarget))) return undefined;
		
		return LS.mapGet(cellsToHitTarget, LS.arraySort(LS.mapKeys(cellsToHitTarget), (a, b) => a - b)[0]);
	}
	
	canMoveToUseOnCell(cell: Cell, caster: number = myLeek.id): Cell | undefined {
		if(LS.canUseChipOnCell(this.id, cell.number)) return field[LS.getCell(caster)];
		
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

	getWeaponDamage(source: number, target: number): {damage: number[], poison: number[], nova: number[], total: number[]} {
		const damage: number = this.weaponTypePosition(WeaponType.DAMAGE);
		const poison: number = this.weaponTypePosition(WeaponType.POISON);
		const nova: number = this.weaponTypePosition(WeaponType.NOVA);

		let dmg: {damage: number[], poison: number[], nova: number[], total: number[]} = {
			damage: [0, 0],
			poison: [0, 0],
			nova: [0, 0],
			total: [0, 0]
		};
		
		if (damage > -1) {
			const formula: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target);
			const minDmg: number = LS.round(this.minValues[damage] * formula);
			const maxDmg: number = LS.round(this.maxValues[damage] * formula);
			dmg.damage = [minDmg, maxDmg];
		}
		if (poison > -1) {
			const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
			const minDmg: number = LS.round(this.minValues[poison] * formula);
			const maxDmg: number = LS.round(this.maxValues[poison] * formula);
			dmg.poison = [minDmg, maxDmg];
		}
		if (nova > -1) {
			const formula: Function = (value: number) => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
			const minDmg: number = LS.round(formula(this.minValues[nova]));
			const maxDmg: number = LS.round(formula(this.maxValues[nova]));
			dmg.nova = [minDmg, maxDmg];
		}
		
		const totalMin: number = LS.intervalMin(dmg.damage) + LS.intervalMin(dmg.poison);
		const totalMax: number = LS.intervalMax(dmg.damage) + LS.intervalMax(dmg.poison);
		dmg.total = [totalMin, totalMax];
		
		return dmg;
	}
}