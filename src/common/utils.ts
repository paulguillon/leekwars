import { LS } from "../globaux/ls";

export function distanceBetween(source: number, target: number) {
    return LS.getCellDistance(LS.getCell(source), LS.getCell(target));
}

export function pathDistanceBetween(source: number, target: number) {
    return LS.getPathLength(LS.getCell(source), LS.getCell(target));
}

export function distanceTo(entityId: number) {
    return LS.getCellDistance(LS.getCell(), LS.getCell(entityId));
}

export function getRandomColor() {
    return LS.getColor(LS.randInt(0, 255), LS.randInt(0, 255), LS.randInt(0, 255));
}

export function findFirst(array: any[], callback: Function): any {
    for (let object of array) {
        if (callback(object)) {
            return object;
        }
    }
    return null;
}
