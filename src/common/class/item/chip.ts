import { AoeType } from "../../../globaux/enums";
import { LS } from "../../../globaux/ls";
import { findFirst } from "../../utils";
import { enemy, field, myLeek } from "../../vars";
import { Cell } from "../cell";
import { chips } from "../../data/chips";
import { ItemEffect } from "./itemEffect";
import { Item } from "./item";

export class Chip extends Item {
    cooldown: number;
    teamCooldown: boolean;
    initialCooldown: number;
    type: number;
    
	constructor(id: number, level: number, teamCooldown: boolean, initialCooldown: number, template: number, type: number) {
		super(
            id, 
            LS.getChipName(id), 
            level, 
            LS.getChipMinRange(id), 
            LS.getChipMaxRange(id), 
            LS.getChipLaunchType(id), 
            LS.arrayMap(LS.getChipEffects(id), (chipEffect: number[]) => new ItemEffect(chipEffect)), 
            LS.getChipCost(id), 
            LS.getChipArea(id),
            LS.chipNeedLos(id), 
            template
        );
		this.cooldown = LS.getChipCooldown(id);
		this.teamCooldown = teamCooldown;
		this.initialCooldown = initialCooldown;
		this.type = type;
	}

	static getById(chipId: number) {
		return findFirst(chips, chip => chip.id == chipId);
	}

    canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
        if (LS.getCooldown(this.id)) return null;
        if (LS.canUseChip(this.id, target)) return field[LS.getCell(caster)];

        const cellsToGo: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], AoeType.CIRCLE, 1, LS.getMP(caster), true);

        let cells: Cell[] = cellsToGo;
        if (this.los) {
            cells = Cell.visibleCells(cellsToGo, LS.getCell(target));
        }
        const cellsInRange: Cell[] = Cell.getCellsInRange(cells, this.minRange, this.maxRange, target);

        return Cell.getClosestCellPathTo(cellsInRange, myLeek.id);
    }

    bestCellToUseChipOn(caster: number, target: number) {
        if (LS.getTP() < this.cost) return null;
        if (LS.getCooldown(this.id)) return null;
        const targetCell: Cell = field[LS.getCell(target)];
        if (LS.canUseChip(this.id, target)) return targetCell;

        const launchCells: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], this.launchType, this.minRange, this.maxRange);
        if (!LS.count(launchCells)) return null;

        const launchCellsWithLos: Cell[] = Cell.visibleCells(launchCells);
        if (!LS.count(launchCellsWithLos)) return null;

        // If target is in launch range
        const response = findFirst(launchCellsWithLos, (cell: Cell) => cell.number == LS.getCell(target));
        if (response) return response;

        const cellsToHitTarget: Cell[] = LS.arrayFilter(launchCellsWithLos, (cell: Cell) => {
            const aoeCells: Cell[] = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
            return LS.inArray(aoeCells, targetCell);
        });
        if (!LS.count(cellsToHitTarget)) return null;

        return Cell.getClosestCellDistanceTo(cellsToHitTarget, target);
    }

    use(caster: number = myLeek.id, target: number = enemy.id, cellToUseChipOn: Cell = this.bestCellToUseChipOn(caster, target)): number {
        if (LS.getCooldown(this.id)) return LS.USE_INVALID_COOLDOWN;
        if (LS.getTP() < this.cost) return LS.USE_NOT_ENOUGH_TP;

        if (!cellToUseChipOn) {
            cellToUseChipOn = field[LS.getCell(target)];
        }

        if (!LS.canUseChipOnCell(this.id, cellToUseChipOn.number)) return LS.USE_INVALID_POSITION;

        const result: number = LS.useChipOnCell(this.id, cellToUseChipOn.number);

        LS.debug(this.name + " : " + result);
        
        return result;
    }

    moveAndUse(caster: number = myLeek.id, target: number = enemy.id) {
        if (LS.getCooldown(this.id)) return LS.USE_INVALID_COOLDOWN;
        if (LS.getTP() < this.cost) return LS.USE_NOT_ENOUGH_TP;

        if (LS.canUseChip(this.id, target)) {
            LS.useChip(this.id, target);
            return;
        }

        const cell: Cell | null = this.canMoveToUse(caster, target);

        if (!cell) return;

        LS.moveTowardCell(cell.number);

        if (this.aoeType != AoeType.POINT) {
            const bestCell: Cell | null = this.bestCellToUseChipOn(caster, target);
            if (bestCell) {
                LS.useChipOnCell(this.id, bestCell.number);
            }
            return;
        }

        LS.useChip(this.id, target);
    }

    hasChipType(searchedType: number): boolean {
        return !!findFirst(this.itemEffects, effect => effect.type == searchedType);
    }

    getChipDamage(source: number, target: number): Object {
        for (const effect of this.itemEffects) {
            if (effect.type == LS.EFFECT_DAMAGE) {
                this.damage.strengthMin += effect.min;
                this.damage.strengthMax += effect.max;
            } else if (effect.type == LS.EFFECT_POISON) {
                const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
                this.damage.poisonMin = LS.round(effect.min * formula);
                this.damage.poisonMax = LS.round(effect.max * formula);
                this.damage.poisonAvg = (this.damage.poisonMin + this.damage.poisonMax) / 2;
                this.damage.poisonMinByTP = effect.min / this.cost;
                this.damage.poisonMaxByTP = effect.max / this.cost;
                this.damage.poisonAvgByTP = (effect.min + effect.max) / 2 / this.cost;
            } else if (effect.type == LS.EFFECT_NOVA_DAMAGE) {
                const formula: Function = (value): number => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
                this.damage.novaMin = LS.round(formula(effect.min));
                this.damage.novaMax = LS.round(formula(effect.max));
                this.damage.novaAvg = (this.damage.novaMin + this.damage.novaMax) / 2;
                this.damage.novaMinByTP = effect.min / this.cost;
                this.damage.novaMaxByTP = effect.max / this.cost;
                this.damage.novaAvgByTP = (effect.min + effect.max) / 2 / this.cost;
            }
        }

        const multiplier: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1)
        const relative: number = (1 - LS.getRelativeShield(target) / 100);
        const absolute: number = LS.getAbsoluteShield(target);
        const calculateDmg: Function = (base) => LS.round(base * multiplier * relative - absolute);

        this.damage.strengthMinByTP = this.damage.strengthMin / this.cost;
        this.damage.strengthMaxByTP = this.damage.strengthMax / this.cost;
        this.damage.strengthAvgByTP = (this.damage.strengthMin + this.damage.strengthMax) / 2 / this.cost;
        this.damage.strengthMin = calculateDmg(this.damage.strengthMin);
        this.damage.strengthMax = calculateDmg(this.damage.strengthMax);
        this.damage.strengthAvg = (this.damage.strengthMin + this.damage.strengthMax) / 2;

        this.damage.totalMin = this.damage.strengthMin + this.damage.poisonMin;
        this.damage.totalMax = this.damage.strengthMax + this.damage.poisonMax;
        this.damage.totalAvg = this.damage.strengthAvg + this.damage.poisonAvg;
        this.damage.totalMinByTP = this.damage.strengthMinByTP + this.damage.poisonMinByTP;
        this.damage.totalMaxByTP = this.damage.strengthMaxByTP + this.damage.poisonMaxByTP;
        this.damage.totalAvgByTP = this.damage.strengthAvgByTP + this.damage.poisonAvgByTP;

        return this.damage;
    }

    static getChipsOf(entity: number = enemy.id): Chip[] {
        return LS.arrayMap(LS.getChips(entity), (chipId: number) => Chip.getById(chipId));
    }

    /**
     * Get entity chips of type
     * @param type searched type of chip
     * @param entity target
     * @returns array of Chip
     */
    static getChipsOfType(type: number, entity: number = enemy.id): Chip[] {
        return LS.arrayFilter(Chip.getChipsOf(entity), chip => LS.inArray(LS.arrayMap(chip.itemEffects, itemEffect => itemEffect.type), type));
    }

    static haveChipEquipped(chipId: number, entity: number = enemy.id): boolean {
        return !!findFirst(LS.getChips(entity), id => id == chipId);
    }

    string() {
        return this.name;
    }
}