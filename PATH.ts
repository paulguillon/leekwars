import { getCellsByArea } from "./class/zone.class.ts"

const enemy: Entity = Fight.getNearestEnemy()
const me: Me = Fight.me
const weapon: Weapon = Weapon.enhancedLightninger
me.setWeapon(weapon)

const canWalkTo: Cell[] = getCellsByArea(me.cell, Item.LaunchType.CIRCLE, 0, me.mp, true)
const enemyCanWalkTo: Cell[] = getCellsByArea(enemy.cell, Item.LaunchType.CIRCLE, 0, enemy.mp, true)

const targetableCellsToHit: Cell[] = me.weaponCells(enemy, weapon, [me])

Debug.log(canWalkTo)
Debug.log(enemyCanWalkTo)
Debug.log(targetableCellsToHit)
Debug.mark(canWalkTo, Color.BLUE)
Debug.mark(enemyCanWalkTo, Color.GREEN)
Debug.mark(targetableCellsToHit, Color.RED)