import { Stat, WeaponType } from "../../globaux/enums";

export class Weapon {
	id: number;
	name: string;
	types: Array<WeaponType>;
	cost: number;
	minValues: Array<number>;
	maxValues: Array<number>;
	sourceStat: Array<Stat>;
	targetStat: Array<Stat>;
	duration: number;
	stackable: boolean;
	minRange: number;
	maxRange: number;
	launchType: string;
	aoeType: string;
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
	
	Cell | null canMoveToUse(number caster = myLeek.id, number target = enemy.id) {
		Cell casterCell = field[LS.getCell(caster)];
		number targetCellNumber = LS.getCell(target);
		
		if(LS.canUseChip(this.id, target)) return casterCell;
		
		Array<Cell> cellsToGo = Cell.getCellsByArea(casterCell, AoeType.CIRCLE, 0, LS.getMP(caster), true);
		
		Array<boolean> result = [];
		
		Map<number, Cell> cellsToHitTarget = [:];
		
		for (Cell cell in cellsToGo) {
			Array<Cell> launchCells = Cell.getCellsByArea(cell, this.launchType, this.minRange, this.maxRange);

			Array<Cell> visibleLaunchCells = Cell.visibleCells(launchCells, targetCellNumber);

			// If target is in launch range
			Cell response = findFirst(visibleLaunchCells, cell => cell.number == targetCellNumber);
			if (response) return response;

			Array<Cell> cells = LS.arrayFilter(visibleLaunchCells, cell => {
				Array<Cell> aoeCells = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
				return LS.inArray(aoeCells, field[targetCellNumber]);
			});
			
			LS.arrayIter(cells, cell => LS.mapPut(cellsToHitTarget, LS.getCellDistance(LS.getCell(caster), LS.getCell(cell.number)), cell));
		}
		
		if(!LS.count(LS.mapKeys(cellsToHitTarget))) return null;
		
		return LS.mapGet(cellsToHitTarget, LS.arraySort(LS.mapKeys(cellsToHitTarget), (a, b) => a - b)[0]);
	}
	
	canMoveToUseOnCell(Cell cell, number caster = myLeek.id) {
		if(LS.canUseChipOnCell(this.id, cell.number)) return field[LS.getCell(caster)];
		
		var cellsToGo = Cell.getCellsByArea(field[LS.getCell(caster)], AoeType.CIRCLE, 0, LS.getMP(caster), true);
		
		var cells = Cell.visibleCells(cellsToGo, cell.number);
		
		return Cell.getClosestCellPathTo(cells, myLeek.id);
	}
	
	static getTargetWeapons(number targetId) {
		return LS.arrayFilter(LS.arrayMap(LS.getWeapons(targetId), weaponId => weapons[weaponId] ? weapons[weaponId] : null), w => w);
	}
	
	static hasWeaponEquipped(Leek target, number weaponId) {
		 return LS.search(LS.getWeapons(target.id), id => id == weaponId) != -1;
	}
	
	hasWeaponType(string weaponType) {
		return LS.inArray(this.types, weaponType);
	}
	
	isCurrentlyEquippedOn(Leek holder) {
		return LS.getWeapon(holder.id) == this.id;
	}
	
	weaponTypePosition(string weaponType) {
		return LS.search(this.types, weaponType, 0);
	}
	
	getWeaponDamage(number source, number target) {
		var damage = weaponTypePosition(WeaponType.DAMAGE);
		var poison = weaponTypePosition(WeaponType.POISON);
		var nova = weaponTypePosition(WeaponType.NOVA);

		var dmg = { 
			damage: [0..0], 
			poison: [0..0], 
			nova: [0..0], 
			total: [0..0]
		};
		
		if (damage > -1) {
			var formula = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target); 
			var minDmg = LS.round(this.minValues[damage] * formula);
			var maxDmg = LS.round(this.maxValues[damage] * formula);
			dmg.damage = [minDmg..maxDmg];
		}
		if (poison > -1) {
			var formula = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
			var minDmg = LS.round(this.minValues[poison] * formula);
			var maxDmg = LS.round(this.maxValues[poison] * formula);
			dmg.poison = [minDmg..maxDmg];
		}
		if (nova > -1) {
			var formula = (value) => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
			var minDmg = LS.round(formula(this.minValues[nova]));
			var maxDmg = LS.round(formula(this.maxValues[nova]));
			dmg.nova = [minDmg..maxDmg];
		}
		
		var totalMin = LS.intervalMin(dmg.damage) + LS.intervalMin(dmg.poison);
		var totalMax = LS.intervalMax(dmg.damage) + LS.intervalMax(dmg.poison);
		dmg.total = [totalMin..totalMax];
		
		return dmg;
	}
}