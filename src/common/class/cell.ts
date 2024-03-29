import { LS } from "../../globaux/ls";
import { AoeType } from "../../globaux/enums";
import { enemy, field, myLeek } from "../vars";
import { Chip } from "./item/chip";
import { Weapon } from "./item/weapon";

export class Cell {
    number: number;
    x: number;
    y: number;
    type: number;
    left: Cell | null;
    up: Cell | null;
    right: Cell | null;
    down: Cell | null;

    constructor(number: number, x: number, y: number, type: number) {
        this.number = number;
        this.x = x;
        this.y = y;
        this.type = type;
        this.left = null;
        this.up = null;
        this.right = null;
        this.down = null;
    }

    static init(cells: Cell[]) {
        for (const cellNumber of [...Array(612).keys()]) {
            let cell: Cell = cells[cellNumber];
            cell.left = cellNumber - 18 < 0 || LS.getCellDistance(cellNumber, cellNumber - 18) > 1 ? null : cells[cellNumber - 18];
            cell.up = cellNumber - 17 < 0 || LS.getCellDistance(cellNumber, cellNumber - 17) > 1 ? null : cells[cellNumber - 17];
            cell.right = cellNumber + 18 > 612 || LS.getCellDistance(cellNumber, cellNumber + 18) > 1 ? null : cells[cellNumber + 18];
            cell.down = cellNumber + 17 > 612 || LS.getCellDistance(cellNumber, cellNumber + 17) > 1 ? null : cells[cellNumber + 17];
        }
    }

    static initField(): Cell[] {
        let cells: Cell[] = [];

        for (const cellNumber of [...Array(612).keys()]) {
            const cell: Cell = new Cell(
                cellNumber,
                LS.getCellX(cellNumber),
                LS.getCellY(cellNumber),
                LS.getCellContent(cellNumber)
            );
            LS.push(cells, cell);
        }

        Cell.init(cells);

        return cells;
    }

    static getCellOf(entity: number): Cell {
        return field[LS.getCell(entity)];
    }

    static getCellFromCoordinates(x: number, y: number): Cell | null {
        const cell: number = LS.getCellFromXY(x, y);
        if (!cell) return null;
        return field[cell];
    }

    /**
     * Renvoie la liste des cellules qui seront affectés si la puce chip est utilisée sur la cellule cell depuis une cellule from.
     * La fonction ne vérifie pas s'il est possible d'utiliser la puce sur la cellule cell ou de se rendre sur la cellule from.

     * Paramètres
     * @param chip : La puce à tester.
     * @param cell : La cellule cible.
     * @param from : La cellule depuis laquelle la puce est utilisée.
     * Retour
     * @return cells : Le tableau contenant les ids de toutes les cellules qui seront affectés.
     */
    static getChipEffectiveArea(chip: Chip, center: number, from: number = LS.getCell(), path: boolean = false): Cell[] {

        let cells: Cell[] = LS.arrayMap(LS.getChipEffectiveArea(chip.id, center, from), cellId => field[cellId]);

        return cells;
    }

    /**
     * Renvoie la liste des cellules qui seront affectés si l'arme weapon est utilisée sur la cellule cell depuis une cellule from.
     * La fonction ne vérifie pas s'il est possible d'utiliser l'arme sur la cellule cell ou de se rendre sur la cellule from.

     * Paramètres
     * @param weapon : L'arme à tester.
     * @param cell : La cellule cible.
     * @param from : La cellule depuis laquelle l'arme est utilisée.
     * Retour
     * @return cells : Le tableau contenant les ids de toutes les cellules qui seront affectés.
     */
    static getWeaponEffectiveArea(weapon: Weapon, center: number, from: number = LS.getCell(), path: boolean = false): Cell[] {

        let cells: Cell[] = LS.arrayMap(LS.getWeaponEffectiveArea(weapon.id, center, from), cellId => field[cellId]);

        return cells;
    }

    static getCellsByArea(center: Cell, aoeType: AoeType, min: number, max: number, path: boolean = false): Cell[] {
        if (min > max) {
            LS.debug("ERROR : min ne peut pas être supérieur à max");
            return [];
        }

        const register = LS.getRegister(aoeType + min + "_" + max);
        if (register) {
            return LS.arrayMap(LS.jsonDecode(register), (id: number) => field[id]);
        }

        let cells: Cell[] = [];
        if (aoeType == AoeType.CIRCLE) {
            for (let x = -max; x <= max; x++) {
                for (let y = -max + LS.abs(x); y <= max - LS.abs(x); y++) {
                    if (LS.abs(x) + LS.abs(y) < min) continue;
                    let cell: Cell | null = Cell.getCellFromCoordinates(center.x + x, center.y + y);
                    if (!cell || cell.type == LS.CELL_OBSTACLE) continue;
                    cells.push(cell);
                }
            }
        } else if (aoeType == AoeType.PLUS) {
            for (let xy = -max; xy <= max; xy++) {
                const cell1: Cell | null = Cell.getCellFromCoordinates(center.x + xy, center.y);
                if (cell1 && LS.getCellDistance(center.number, cell1.number) >= min && cell1.type != LS.CELL_OBSTACLE) {
                    cells.push(cell1);
                }
                const cell2: Cell | null = Cell.getCellFromCoordinates(center.x, center.y + xy);
                if (cell2 && LS.getCellDistance(center.number, cell2.number) >= min && cell2.type != LS.CELL_OBSTACLE) {
                    cells.push(cell2);
                }
            }

        } else if (aoeType == AoeType.SQUARE) {
            for (let x = -max; x <= max; x++) {
                for (let y = -max; y <= max; y++) {
                    const cell: Cell | null = Cell.getCellFromCoordinates(center.x + x, center.y + y);
                    if (!cell || LS.abs(x) < min && LS.abs(y) < min || cell.type == LS.CELL_OBSTACLE) continue;
                    cells.push(cell);
                }
            }
        }

        if (!path) return cells;
        const entity: number = LS.getEntityOnCell(center.number);
        return LS.arrayFilter(cells, (cell: Cell): boolean => LS.getPathLength(LS.getCell(entity), cell.number) <= LS.getMP(entity));
    }

    static getCellsToGo(entity: number = myLeek.id, min: number = 0, mp: number = LS.getMP(entity)): Cell[] {
        return Cell.getCellsByArea(field[LS.getCell(entity)], AoeType.CIRCLE, min, mp, true);
    }

    static getFurthestCellDistanceFrom(cells: Cell[], entity: number): Cell | null {
        if (!LS.count(cells)) return null;
        const fromCell: number = LS.getCell(entity);

        let furthestCell: Cell = cells[0];
        let furthestCellDistance: number = LS.getCellDistance(fromCell, cells[0].number);

        for (const cell of cells) {
            const cellDistance: number = LS.getCellDistance(fromCell, cell.number);
            if (cellDistance > furthestCellDistance) {
                furthestCell = cell;
                furthestCellDistance = cellDistance;
            }
        }

        return furthestCell;
    }

    static getClosestCellDistanceTo(cells: Cell[], target: number): Cell | null {
        if (!LS.count(cells)) return null;
        let bestCell: Cell = cells[0];
        let distance: number = LS.getCellDistance(LS.getCell(target), bestCell.number);

        for (const cell of cells) {
            const cellDistance: number = LS.getCellDistance(cell.number, LS.getCell(target));

            if (cellDistance < distance && cell.type == LS.CELL_EMPTY) {
                bestCell = cell;
                distance = cellDistance;
            }
        }
        return bestCell;
    }

    static getClosestCellPathTo(cells: Cell[], entity: number): Cell | null {
        if (!LS.count(cells)) return null;
        const ofCell: number = LS.getCell(entity);

        let closestCell: Cell = cells[0];
        let closestCellPathLength: number = LS.getPathLength(ofCell, cells[0].number);

        for (const cell of cells) {
            const cellPathLength: number = LS.getPathLength(ofCell, cell.number);
            if (cellPathLength == null) continue;
            if (cellPathLength < closestCellPathLength || closestCellPathLength == null) {
                closestCell = cell;
                closestCellPathLength = cellPathLength;
            }
        }

        return closestCell;
    }

    static visibleCells(cellsToCheck: Cell[], targetCell: number = LS.getCell(myLeek.id)): Cell[] {
        if (!LS.count(cellsToCheck)) return [];

        return LS.arrayFilter(cellsToCheck, (cell: Cell) => LS.lineOfSight(cell.number, targetCell));
    }

    static hiddenCells(cellsToCheck: Cell[], target: number = enemy.id): Cell[] {
        if (!LS.count(cellsToCheck)) return [];

        return LS.arrayFilter(cellsToCheck, (cell: Cell) => !LS.lineOfSight(cell.number, LS.getCell(target)));
    }

    static getCellsInRange(cells: Cell[], min: number, max: number, target: number = enemy.id): Cell[] {
        return LS.arrayFilter(cells, (cell: Cell) => LS.getCellDistance(cell.number, LS.getCell(target)) >= min && max <= LS.getCellDistance(cell.number, LS.getCell(target)));
    }

    static toCells(cells: Cell[]): number[] {
        return LS.arrayMap(cells, (cell: Cell) => cell.number);
    }

    string(): string {
        return "N°" + this.number;
    }
}