import {ChipType} from "../../globaux/types";

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
    launchType: string;
    aoeType: string;
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

    static bestCellToUseChipOn(chipId: number, number caster, number target) {
        var chip = chips[chipId];

        if (!chip) return;

        if (LS.getTP() < chip.cost) return;
        if (LS.getCooldown(chipId)) return;

        var launchCells = Cell.getCellsByArea(field[LS.getCell(caster)], chip.launchType, chip.minRange, chip.maxRange);
        if (!LS.count(launchCells)) return;

        var launchCellsWithLos = Cell.visibleCells(launchCells);
        if (!LS.count(launchCellsWithLos)) return;

        // If target is in launch range
        var response = findFirst(launchCellsWithLos, cell => cell.number == LS.getCell(target));
        if (response) return response;

        var cellsToHitTarget = launchCellsWithLos.filter((cell: Cell) => {
            var aoeCells = Cell.getCellsByArea(cell, chip.aoeType, 0, chip.aoeSize);
            return aoeCells.includes(field[LS.getCell(target)]);
        });
        if (!LS.count(cellsToHitTarget)) return;

        return Cell.getClosestCellDistanceTo(cellsToHitTarget, target);
    }

    static use(number chipId, number caster = myLeek.id, number target = enemy.id, Cell cellToUseChipOn = null) {
        cellToUseChipOn = cellToUseChipOn ? cellToUseChipOn : Chip.bestCellToUseChipOn(chipId, caster, target);
        if (!cellToUseChipOn) return;

        return LS.useChipOnCell(chipId, cellToUseChipOn.number);
    }

    moveAndUse(number caster = myLeek.id, number target = enemy.id) {
        if(LS.canUseChip(this.id, target)) {
            LS.useChip(this.id, target);
            return;
        }

        Cell cell = canMoveToUse(caster, target);

        if(!cell) return;

        LS.moveTowardCell(cell.number);

        if(this.aoeType != AoeType.POINT) {
            Cell bestCell = bestCellToUseChipOn(this.id, caster, target);
            if(bestCell) {
                LS.useChipOnCell(this.id, bestCell.number);
            }
            return;
        }

        LS.useChip(this.id, target);
    }

    boolean hasChipType(ChipType chipType) {
        return findFirst(this.types, type => type == chipType);
    }

    Object getChipDamage(number source, number target) {
        var dmg = {
            damage: [0..0],
            poison: [0..0],
            nova: [0..0],
            total: [0..0]
        };

        var damageMin = 0;
        var damageMax = 0;

        for (var i = 0; i < LS.count(this.types); i++) {
            var type = this.types[i];

            if (type == ChipType.DAMAGE) {
                var formula = (LS.getStrength(source) / 100 + 1) * (LS.getPower(source) / 100 + 1) * (1 - LS.getRelativeShield(target) / 100) - LS.getAbsoluteShield(target);
                damageMin += this.minValues[i] * formula;
                damageMax += this.maxValues[i] * formula;
            } else if (type == ChipType.POISON) {
                var formula = (LS.getMagic(source) / 100 + 1) * (LS.getPower(source) / 100 + 1);
                var minDmg = this.minValues[i] * formula;
                var maxDmg = this.maxValues[i] * formula;
                dmg.poison = [minDmg..maxDmg];
            } else if (type == ChipType.NOVA) {
                var formula = (value) => min(LS.getTotalLife(target) - LS.getLife(target), value * (LS.getScience(source) / 100 + 1) * (LS.getPower(source) / 100 + 1));
                var minDmg = formula(this.minValues[i]);
                var maxDmg = formula(this.maxValues[i]);
                dmg.nova = [minDmg..maxDmg];
            }
        }
        dmg.damage = [damageMin..damageMax];

        var totalMin = LS.intervalMin(dmg.damage) + LS.intervalMin(dmg.poison);
        var totalMax = LS.intervalMax(dmg.damage) + LS.intervalMax(dmg.poison);
        dmg.total = [totalMin..totalMax];

        return dmg;
    }

    static Array<Chip> getChipsOf(number entity = enemy.id) {
        return LS.arrayFilter(LS.arrayMap(LS.getChips(entity), chipId => chips[chipId] ? chips[chipId] : null), chip => chip);
    }

    static Array<Chip> getChipsOfType(string chipType, number entity = enemy.id) {
        return LS.arrayMap(LS.arrayFilter(LS.getChipsOf(entity), chip => LS.inArray(chip.types, chipType)), chip => LS.getChipName(chip.id));
    }

    static boolean haveChipEquipped(number chipId, number entity = enemy.id) {
        return findFirst(LS.getChips(entity), id => id == chipId);
    }
}