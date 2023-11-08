import { AoeType, ChipType, Stat } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { chips } from "../data/chips";
import { findFirst } from "../utils";
import { enemy, field, myLeek } from "../vars";
import { Cell } from "./cell";

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

    constructor(obj) {
        this.id = obj.id;
        this.types = obj.types;
        this.cost = obj.cost;
        this.minValues = obj.minValues;
        this.maxValues = obj.maxValues;
        this.cooldown = obj.cooldown;
        this.sourceStat = obj.sourceStat;
        this.targetStat = obj.targetStat;
        this.duration = obj.duration;
        this.minRange = obj.minRange;
        this.maxRange = obj.maxRange;
        this.launchType = obj.launchType;
        this.aoeType = obj.aoeType;
        this.aoeSize = obj.aoeSize;
        this.los = obj.los;
    }

    canMoveToUse(caster: number = myLeek.id, target: number = enemy.id) {
        if(LS.canUseChip(this.id, target)) return field[LS.getCell(caster)];

        const cellsToGo: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], AoeType.CIRCLE, 1, LS.getMP(caster), true);

        let cells: Cell[] = cellsToGo;
        if(this.los) {
            cells = Cell.visibleCells(cellsToGo, LS.getCell(target));
        }
        const cellsInRange: Cell[] = Cell.getCellsInRange(cells, this.minRange, this.maxRange, target);

        return Cell.getClosestCellPathTo(cellsInRange, myLeek.id);
    }

    static bestCellToUseChipOn(chipId: number, caster:number, target: number) {
        const chip: Chip = chips[chipId];

        if (!chip) return null;

        if (LS.getTP() < chip.cost) return null;
        if (LS.getCooldown(chipId)) return null;

        const launchCells: Cell[] = Cell.getCellsByArea(field[LS.getCell(caster)], chip.launchType, chip.minRange, chip.maxRange);
        if (!LS.count(launchCells)) return null;

        const launchCellsWithLos: Cell[] = Cell.visibleCells(launchCells);
        if (!LS.count(launchCellsWithLos)) return null;

        // If target is in launch range
        const response = findFirst(launchCellsWithLos, cell => cell.number == LS.getCell(target));
        if (response) return response;

        const cellsToHitTarget: Cell[] = launchCellsWithLos.filter((cell: Cell) => {
            var aoeCells = Cell.getCellsByArea(cell, chip.aoeType, 0, chip.aoeSize);
            return aoeCells.includes(field[LS.getCell(target)]);
        });
        if (!LS.count(cellsToHitTarget)) return null;

        return Cell.getClosestCellDistanceTo(cellsToHitTarget, target);
    }

    static use(chipId: number, caster: number = myLeek.id, target: number = enemy.id, cellToUseChipOn: Cell | null = null): number {
        cellToUseChipOn = cellToUseChipOn ? cellToUseChipOn : Chip.bestCellToUseChipOn(chipId, caster, target);
        if (!cellToUseChipOn) return LS.USE_INVALID_TARGET;

        return LS.useChipOnCell(chipId, cellToUseChipOn.number);
    }

    moveAndUse(caster: number = myLeek.id, target: number = enemy.id) {
        if(LS.canUseChip(this.id, target)) {
            LS.useChip(this.id, target);
            return;
        }

        const cell: Cell | null = this.canMoveToUse(caster, target);

        if(!cell) return;

        LS.moveTowardCell(cell.number);

        if(this.aoeType != AoeType.POINT) {
            const bestCell: Cell | null = Chip.bestCellToUseChipOn(this.id, caster, target);
            if(bestCell) {
                LS.useChipOnCell(this.id, bestCell.number);
            }
            return;
        }

        LS.useChip(this.id, target);
    }

    hasChipType(chipType: ChipType): boolean {
        return findFirst(this.types, type => type == chipType);
    }

    getChipDamage(source: number, target: number): Object {
        let dmg = {
            damage: [0,0],
            poison: [0,0],
            nova: [0,0],
            total: [0,0]
        };

        let damageMin = 0;
        let damageMax = 0;

        for (let i = 0; i < LS.count(this.types); i++) {
            const type: ChipType = this.types[i];

            if (type == ChipType.DAMAGE) {
                const formula: number = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target);
                damageMin += this.minValues[i] * formula;
                damageMax += this.maxValues[i] * formula;
            } else if (type == ChipType.POISON) {
                const formula: number = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
                const minDmg: number = this.minValues[i] * formula;
                const maxDmg: number = this.maxValues[i] * formula;
                dmg.poison = [minDmg, maxDmg];
            } else if (type == ChipType.NOVA) {
                const formula: Function = (value): number => Math.min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
                const minDmg: number = formula(this.minValues[i]);
                const maxDmg: number = formula(this.maxValues[i]);
                dmg.nova = [minDmg, maxDmg];
            }
        }
        dmg.damage = [damageMin, damageMax];

        const totalMin: number = LS.intervalMin(dmg.damage) + LS.intervalMin(dmg.poison);
        const totalMax: number = LS.intervalMax(dmg.damage) + LS.intervalMax(dmg.poison);
        dmg.total = [totalMin, totalMax];

        return dmg;
    }

    static getChipsOf(entity: number = enemy.id): Chip[] {
        return LS.arrayMap(LS.getChips(entity), (chipId: number) => chips[chipId]);
    }

    static getChipsOfType(chipType: ChipType, entity: number = enemy.id): Chip[] {
        return LS.arrayFilter(Chip.getChipsOf(entity), chip => LS.inArray(chip.types, chipType));
    }

    static haveChipEquipped(chipId: number, entity: number = enemy.id): boolean {
        return findFirst(LS.getChips(entity), id => id == chipId);
    }
}