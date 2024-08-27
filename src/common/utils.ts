import { getCell, getCellDistance, getColor, getPathLength, randInt } from "transpiler-ls";

export function distanceBetween(source: number, target: number) {
    return getCellDistance(getCell(source), getCell(target));
}

export function pathDistanceBetween(source: number, target: number) {
    return getPathLength(getCell(source), getCell(target));
}

export function distanceTo(entityId: number) {
    return getCellDistance(getCell(), getCell(entityId));
}

export function getRandomColor() {
    return getColor(randInt(0, 255), randInt(0, 255), randInt(0, 255));
}

export function findFirst(array: any[], callback: Function): any {
    for (let object of array) {
        if (callback(object)) {
            return object;
        }
    }
    return null;
}
