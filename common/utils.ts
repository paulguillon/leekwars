import {LS} from "../globaux/ls";

export function distanceBetween(source: number, target: number) {
    return LS.getCellDistance(LS.getCell(source), LS.getCell(target));
}

export function pathDistanceBetween(source: number, target: number) {
    return LS.getPathLength(LS.getCell(source), LS.getCell(target));
}

export function distanceTo(entityId: number) {
    return LS.getCellDistance(LS.getCell(), LS.getCell(entityId));
}

export function canUseMultipleChips(source: number, target: number, chips: number[]) {
    let totalCost = 0;
    for (let chip of chips) {
        if (!LS.canUseChip(chip, target) || LS.getCooldown(chip, source)) {
            return false;
        }
        totalCost += LS.getChipCost(chip);
    }
    return LS.getTP(source) > totalCost;
}

export function getRandomColor() {
    return LS.getColor(LS.randInt(0, 255), LS.randInt(0, 255), LS.randInt(0, 255));
}

export function findFirst(array: Array<any>, callback: Function) {
    for (let object in array) {
        if (callback(object)) {
            return object;
        }
    }
    return null;
}
