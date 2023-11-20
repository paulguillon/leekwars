import { AoeType, ChipType, Stat } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { findFirst } from "../utils";
import { enemy, field, myLeek } from "../vars";
import { Cell } from "./cell";
import { chips } from "../data/chips";
import { Damage } from "./damage";

export class Chip {
    id: number;
    types: ChipType[];
    cost: number;
    minValues: number[];
    maxValues: number[];
    cooldown: number;
    sourceStat: Stat[];
    targetStat: Stat[];
    duration: number;
    minRange: number;
    maxRange: number;
    launchType: AoeType;
    aoeType: AoeType;
    aoeSize: number;
    los: boolean;

    constructor(id: number, types: ChipType[], cost: number, minValues: number[], maxValues: number[], cooldown: number, sourceStat: Stat[], targetStat: Stat[], duration: number, minRange: number, maxRange: number, launchType: AoeType, aoeType: AoeType, aoeSize: number, los: boolean) {
        this.id = id;
        this.types = types;
        this.cost = cost;
        this.minValues = minValues;
        this.maxValues = maxValues;
        this.cooldown = cooldown;
        this.sourceStat = sourceStat;
        this.targetStat = targetStat;
        this.duration = duration;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.launchType = launchType;
        this.aoeType = aoeType;
        this.aoeSize = aoeSize;
        this.los = los;
    }

    canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
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

        const launchCells: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], this.launchType, this.minRange, this.maxRange);
        if (!LS.count(launchCells)) return null;

        const launchCellsWithLos: Cell[] = Cell.visibleCells(launchCells);
        if (!LS.count(launchCellsWithLos)) return null;

        // If target is in launch range
        const response = findFirst(launchCellsWithLos, (cell: Cell) => cell.number == LS.getCell(target));
        if (response) return response;

        const cellsToHitTarget: Cell[] = LS.arrayFilter(launchCellsWithLos, (cell: Cell) => {
            const aoeCells: Cell[] = Cell.getCellsByArea(cell, this.aoeType, 0, this.aoeSize);
            return aoeCells.includes(field[LS.getCell(target)]);
        });
        if (!LS.count(cellsToHitTarget)) return null;

        return Cell.getClosestCellDistanceTo(cellsToHitTarget, target);
    }

    use(caster: number = myLeek.id, target: number = enemy.id, cellToUseChipOn: Cell = this.bestCellToUseChipOn(caster, target)): number {
        if(!cellToUseChipOn) {
            cellToUseChipOn = field[LS.getCell(target)];
        }
        return LS.useChipOnCell(this.id, cellToUseChipOn.number);
    }

    moveAndUse(caster: number = myLeek.id, target: number = enemy.id) {
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

    hasChipType(chipType: ChipType): boolean {
        return !!findFirst(this.types, type => type == chipType);
    }

    getChipDamage(source: number, target: number): Object {
        let damage: Damage = new Damage();

        for (let i = 0; i < LS.count(this.types); i++) {
            const type: ChipType = this.types[i];

            if (type == ChipType.STRENGTH) {
                damage.strengthMin += this.minValues[i];
                damage.strengthMax += this.maxValues[i];
            } else if (type == ChipType.POISON) {
                const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
                damage.poisonMin = LS.round(this.minValues[i] * formula);
                damage.poisonMax = LS.round(this.maxValues[i] * formula);
                damage.poisonAvg = (damage.poisonMin + damage.poisonMax) / 2;
                damage.poisonMinByTP = this.minValues[i] / this.cost;
                damage.poisonMaxByTP = this.maxValues[i] / this.cost;
                damage.poisonAvgByTP = (this.minValues[i] + this.maxValues[i]) / 2 / this.cost;
            } else if (type == ChipType.NOVA) {
                const formula: Function = (value): number => LS.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
                damage.novaMin = LS.round(formula(this.minValues[i]));
                damage.novaMax = LS.round(formula(this.maxValues[i]));
                damage.novaAvg = (damage.novaMin + damage.novaMax) / 2;
                damage.novaMinByTP = this.minValues[i] / this.cost;
                damage.novaMaxByTP = this.maxValues[i] / this.cost;
                damage.novaAvgByTP = (this.minValues[i] + this.maxValues[i]) / 2 / this.cost;
            }
        }

        const formula: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target);
        damage.strengthMinByTP = damage.strengthMin / this.cost;
        damage.strengthMaxByTP = damage.strengthMax / this.cost;
        damage.strengthAvgByTP = (damage.strengthMin + damage.strengthMax) / 2 / this.cost;
        damage.strengthMin = LS.round(damage.strengthMin * formula);
        damage.strengthMax = LS.round(damage.strengthMax * formula);
        damage.strengthAvg = (damage.strengthMin + damage.strengthMax) / 2;

		damage.totalMin = damage.strengthMin + damage.poisonMin;
		damage.totalMax = damage.strengthMax + damage.poisonMax;
		damage.totalAvg = damage.strengthAvg + damage.poisonAvg;
		damage.totalMinByTP = damage.strengthMinByTP + damage.poisonMinByTP;
		damage.totalMaxByTP = damage.strengthMaxByTP + damage.poisonMaxByTP;
		damage.totalAvgByTP = damage.strengthAvgByTP + damage.poisonAvgByTP;

        return damage;
    }

    static getChipsOf(entity: number = enemy.id): Chip[] {
        return LS.arrayMap(LS.getChips(entity), (chipId: number) => chips[chipId]);
    }

    static getChipsOfType(chipType: ChipType, entity: number = enemy.id): Chip[] {
        return LS.arrayFilter(Chip.getChipsOf(entity), chip => LS.inArray(chip.types, chipType));
    }

    static haveChipEquipped(chipId: number, entity: number = enemy.id): boolean {
        return !!findFirst(LS.getChips(entity), id => id == chipId);
    }
}