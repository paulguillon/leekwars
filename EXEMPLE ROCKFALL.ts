const enemy: Entity = Fight.getNearestEnemy()
const me: Me = Fight.me
const rockFallAoe: Cell[] = Chip.rockfall.effectiveArea(enemy)

const rockfallLaunch: Cell[] = me.chipCells(Chip.rockfall, me, [enemy])
Debug.mark(rockfallLaunch, Color.BLUE)

const rockFallAoeLos: Cell[] = rockFallAoe.filter((cell) => cell.lineOfSight(me, [enemy]))
Debug.mark(rockFallAoeLos, Color.RED)

const cellsToUseRockfall: Cell[] = rockFallAoeLos.filter((cell) => rockfallLaunch.includes(cell))
Debug.mark(cellsToUseRockfall, Color.GREEN)

const cells: Cell[] = cellsToUseRockfall.sort((a, b) => enemy.distance(a) - enemy.distance(b))

const closestCellToEnemy: Cell = cells[0]
Debug.mark(closestCellToEnemy, Color.BLUE)


Debug.markText(closestCellToEnemy, "TIRE ICI", Color.rgb(0, 248, 33))