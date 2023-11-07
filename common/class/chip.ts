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

    canMoveToUse(number caster = myLeek.id, number target = enemy.id) {
    if(canUseChip(this.id, target)) return field[getCell(caster)];

    var cellsToGo = Cell.getCellsByArea(field[getCell(caster)], AoeType.CIRCLE, 1, getMP(caster), true);

    var cells = cellsToGo;
    if(this.los) {
    cells = Cell.visibleCells(cellsToGo, getCell(target));
}
var cellsInRange = Cell.getCellsInRange(cells, this.minRange, this.maxRange, target);

return Cell.getClosestCellPathTo(cellsInRange, myLeek.id);
}

static bestCellToUseChipOn(number chipId, number caster, number target) {
    var chip = chips[chipId];

    if (!chip) return;

    if (getTP() < chip.cost) return;
    if (getCooldown(chipId)) return;

    var launchCells = Cell.getCellsByArea(field[getCell(caster)], chip.launchType, chip.minRange, chip.maxRange);
    if (!count(launchCells)) return;

    var launchCellsWithLos = Cell.visibleCells(launchCells);
    if (!count(launchCellsWithLos)) return;

    // If target is in launch range
    var response = findFirst(launchCellsWithLos, cell => cell.number == getCell(target));
    if (response) return response;

    var cellsToHitTarget = arrayFilter(launchCellsWithLos, cell => {
        var aoeCells = Cell.getCellsByArea(cell, chip.aoeType, 0, chip.aoeSize);
        return inArray(aoeCells, field[getCell(target)]);
    });
    if (!count(cellsToHitTarget)) return;

    return Cell.getClosestCellDistanceTo(cellsToHitTarget, target);
}

static use(number chipId, number caster = myLeek.id, number target = enemy.id, Cell cellToUseChipOn = null) {
    cellToUseChipOn = cellToUseChipOn ? cellToUseChipOn : Chip.bestCellToUseChipOn(chipId, caster, target);
    debug("CellToUseChipOn : " + cellToUseChipOn)
    if (!cellToUseChipOn) return;

    return useChipOnCell(chipId, cellToUseChipOn.number);
}

moveAndUse(number caster = myLeek.id, number target = enemy.id) {
    if(canUseChip(this.id, target)) {
        useChip(this.id, target);
        return;
    }

    Cell cell = canMoveToUse(caster, target);

    if(!cell) return;

    moveTowardCell(cell.number);

    if(this.aoeType != AoeType.POINT) {
        Cell bestCell = bestCellToUseChipOn(this.id, caster, target);
        if(bestCell) {
            useChipOnCell(this.id, bestCell.number);
        }
        return;
    }

    useChip(this.id, target);
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

    for (var i = 0; i < count(this.types); i++) {
        var type = this.types[i];

        if (type == ChipType.DAMAGE) {
            var formula = (getStrength(source) / 100 + 1) * (getPower(source) / 100 + 1) * (1 - getRelativeShield(target) / 100) - getAbsoluteShield(target);
            damageMin += this.minValues[i] * formula;
            damageMax += this.maxValues[i] * formula;
        } else if (type == ChipType.POISON) {
            var formula = (getMagic(source) / 100 + 1) * (getPower(source) / 100 + 1);
            var minDmg = this.minValues[i] * formula;
            var maxDmg = this.maxValues[i] * formula;
            dmg.poison = [minDmg..maxDmg];
        } else if (type == ChipType.NOVA) {
            var formula = (value) => min(getTotalLife(target) - getLife(target), value * (getScience(source) / 100 + 1) * (getPower(source) / 100 + 1));
            var minDmg = formula(this.minValues[i]);
            var maxDmg = formula(this.maxValues[i]);
            dmg.nova = [minDmg..maxDmg];
        }
    }
    dmg.damage = [damageMin..damageMax];

    var totalMin = intervalMin(dmg.damage) + intervalMin(dmg.poison);
    var totalMax = intervalMax(dmg.damage) + intervalMax(dmg.poison);
    dmg.total = [totalMin..totalMax];

    return dmg;
}

static Array<Chip> getChipsOf(number entity = enemy.id) {
    return arrayFilter(arrayMap(getChips(entity), chipId => chips[chipId] ? chips[chipId] : null), chip => chip);
}

static Array<Chip> getChipsOfType(string chipType, number entity = enemy.id) {
    return arrayMap(arrayFilter(getChipsOf(entity), chip => inArray(chip.types, chipType)), chip => getChipName(chip.id));
}

static boolean haveChipEquipped(number chipId, number entity = enemy.id) {
    return findFirst(getChips(entity), id => id == chipId);
}
}