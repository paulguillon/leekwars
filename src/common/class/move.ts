import { LS } from "../../globaux/ls";
import { Cell } from "./cell";
import { enemy, myLeek } from "../vars";

export class Move {
	static moveAndUseChip(chipId: number, cell: Cell, target: number): void {
		LS.moveTowardCell(cell.number);
		LS.useChipOnCell(chipId, LS.getCell(target));
	}

	static hideToward(entity: number = myLeek.id, target: number = enemy.id): void {
		let cellsToGo: Cell[] = Cell.getCellsToGo();
		cellsToGo = Cell.hiddenCells(cellsToGo, target);

		const cellToGo: Cell | null = Cell.getClosestCellPathTo(cellsToGo, target);
		if (cellToGo) {
			LS.moveTowardCell(cellToGo.number);
		}
	}

	static hide(close: boolean = true, forward: boolean = false, target: number = enemy.id): void {
		const cellsToGo: Cell[] = Cell.getCellsToGo(myLeek.id, 0, close ? LS.floor(LS.getMP() / 2) : LS.getMP());

		const hiddenCells: Cell[] = Cell.hiddenCells(cellsToGo, target);

		const bestCellToGoToHide: Cell | null = close ? Cell.getClosestCellDistanceTo(hiddenCells, myLeek.id) : Cell.getFurthestCellDistanceFrom(hiddenCells, target);

		if (bestCellToGoToHide) {
			LS.moveTowardCell(bestCellToGoToHide.number);
		} else if (close) {
			Move.hide(false);
		}
	}
}