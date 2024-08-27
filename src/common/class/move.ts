import { floor, getCell, getMP, moveTowardCell, useChipOnCell } from "transpiler-ls";
import { Cell } from "./cell";
import { enemy, myLeek } from "../vars";

export class Move {
	static moveAndUseChip(chipId: number, cell: Cell, target: number): void {
		moveTowardCell(cell.number);
		useChipOnCell(chipId, getCell(target));
	}

	static hideToward(entity: number = myLeek.id, target: number = enemy.id): void {
		let cellsToGo: Cell[] = Cell.getCellsToGo();
		cellsToGo = Cell.hiddenCells(cellsToGo, target);

		const cellToGo: Cell | null = Cell.getClosestCellPathTo(cellsToGo, target);
		if (cellToGo) {
			moveTowardCell(cellToGo.number);
		}
	}

	static hide(close: boolean = true, forward: boolean = false, target: number = enemy.id): void {
		const cellsToGo: Cell[] = Cell.getCellsToGo(myLeek.id, 0, close ? floor(getMP() / 2) : getMP());

		const hiddenCells: Cell[] = Cell.hiddenCells(cellsToGo, target);

		const bestCellToGoToHide: Cell | null = close ? Cell.getClosestCellDistanceTo(hiddenCells, myLeek.id) : Cell.getFurthestCellDistanceFrom(hiddenCells, target);

		if (bestCellToGoToHide) {
			moveTowardCell(bestCellToGoToHide.number);
		} else if (close) {
			Move.hide(false);
		}
	}
}