export class Move {
	static void moveAndUseChip(integer chipId, Cell cell, integer target) {
		LS.moveTowardCell(cell.number);
		LS.useChipOnCell(chipId, LS.getCell(target));
	}
	
	static void hideToward(integer entity = myLeek.id, integer target = enemy.id) {
		Array<Cell> cellsToGo = Cell.getCellsToGo();
		cellsToGo = Cell.hiddenCells(cellsToGo, target);
		
		Cell cellToGo = Cell.getClosestCellPathTo(cellsToGo, target);
		if(cellToGo) {
			LS.moveTowardCell(cellToGo.number);
		}
	}
	
	static void hide(boolean close = true, boolean forward = false, integer target = enemy.id) {
		var cellsToGo = Cell.getCellsToGo(myLeek.id, 0, close ? LS.floor(LS.getMP() / 2) : LS.getMP());
		
		var hiddenCells = Cell.hiddenCells(cellsToGo, target);
		
		var bestCellToGoToHide = close ? Cell.getClosestCellDistanceTo(hiddenCells, myLeek.id) : Cell.getFurthestCellDistanceFrom(hiddenCells, target);

		if (bestCellToGoToHide) {
			LS.moveTowardCell(bestCellToGoToHide.number);
		} else if (close) {
			Move.hide(false);
		}
	}
}