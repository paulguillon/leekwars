const enemy: Entity = Fight.getNearestEnemy()
const me: Me = Fight.me
const weapon: Weapon = Weapon.enhancedLightninger
const weaponAoe: Cell[] = weapon.effectiveArea(enemy)

Debug.log(System.operations)
const weaponLaunch: Cell[] = me.weaponCells(me, weapon, [enemy])

Debug.log(System.operations)
Debug.mark(weaponLaunch, Color.BLUE)

const weaponAoeLos: Cell[] = weaponAoe.filter((cell) => cell.lineOfSight(me, [enemy]))
Debug.mark(weaponAoeLos, Color.RED)

const cellsToUseWeapon: Cell[] = weaponAoeLos.filter((cell) => weaponLaunch.includes(cell))
Debug.mark(cellsToUseWeapon, Color.GREEN)

const cells: Cell[] = cellsToUseWeapon.sort((a, b) => enemy.distance(a) - enemy.distance(b))

const closestCellToEnemy: Cell = cells[0]
Debug.mark(closestCellToEnemy, Color.BLUE)

Debug.markText(closestCellToEnemy, "TIRE ICI", Color.rgb(0, 248, 33))