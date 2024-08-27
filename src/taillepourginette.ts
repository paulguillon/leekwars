import { CHIP_ADRENALINE, CHIP_ANTIDOTE, CHIP_ARMORING, CHIP_COVETOUSNESS, CHIP_CURE, CHIP_ELEVATION, CHIP_KNOWLEDGE, CHIP_MIRROR, CHIP_MOTIVATION, CHIP_PROTEIN, CHIP_RAGE, CHIP_REGENERATION, CHIP_REMISSION, CHIP_SERUM, CHIP_STEROID, CHIP_TRANSMUTATION, CHIP_WALL, CHIP_WARM_UP, EFFECT_ABSOLUTE_SHIELD, EFFECT_POISON, EFFECT_RELATIVE_SHIELD, arrayMap, arraySort, debug, floor, getCell, getCellsToUseWeapon, getCooldown, getNearestEnemy, getPathLength, getWeapon, mapIsEmpty, mapKeys, moveToward, moveTowardCell, useChip, useChipOnCell, useWeapon } from "transpiler-ls";
import { enemy, field, myLeek, searchEnemy, turn } from "./common/vars";
import { Effect } from "./common/class/effect";
import { distanceTo, pathDistanceBetween } from "./common/utils";
import { Damage } from "./common/class/damage";
import { Cell } from "./common/class/cell";
import { Weapon } from "./common/class/item/weapon";
import { AXE, M_LASER, RHINO } from "./common/data/weapons";
import { LIBERATION, PROTEIN, ROCKFALL, STALACTITE } from "./common/data/chips";

/*
 * Stat : 400 agility, 400 strength, 6 MP, 19 TP, 300 wisdom, 120 science then full HP
 * Chips :   cure, rage, adrenaline, antidote, steroid, protein, liberation, regen, stalactite, rockfall, armoring, serum, covetousness, mirror, elevation, transmutation, mutation
 * Weapons : unstable destroyer, axe, m laser, rhino
 */

if (distanceTo(enemy.id) > myLeek.mp() || enemy.life() > 1200) {
    useChip(CHIP_WARM_UP);
}

if (!getWeapon()) {
    myLeek.changeWeapon(M_LASER);
}

useChip(CHIP_ADRENALINE);

let weaponsThatCanKill = new Map<number, Weapon>();

// Test if can kill with any weapon
for (const weapon of myLeek.weapons) {
    let currentTP: number = myLeek.tp();

    if (myLeek.weapon !== weapon) {
        currentTP--;
    }

    const nbUses: number = floor(currentTP / weapon.cost);
    currentTP -= nbUses * weapon.cost;

    // TODO rework canmovetouse
    var cellsToUse = arrayMap(getCellsToUseWeapon(weapon.id, enemy.id), c => field[c]);
    var closest = Cell.getClosestCellPathTo(cellsToUse, myLeek.id);

    debug("--------------------------");
    debug(weapon.name);
    debug("Nb uses : " + nbUses);
    debug("PA utilisés : " + (myLeek.tp() - currentTP));
    debug("PA restants : " + currentTP);
    
    const canMove: Cell | null = (closest && getPathLength(closest.number, getCell()) < myLeek.mp()) ? closest : null;

    if (!canMove) continue;

    const weaponDmg: Damage = weapon.getWeaponDamage();

    debug("Dégats avg : " + weaponDmg.strengthAvg);
    debug("Total avg : " + nbUses * weaponDmg.strengthAvg);

    const canKill: boolean = enemy.life() <= weaponDmg.strengthAvg * nbUses;

    if (canKill) {
        weaponsThatCanKill[weaponDmg.totalAvg * nbUses] = weapon;
    }
}

if (!mapIsEmpty(weaponsThatCanKill)) {
    debug("Les armes qui peuvent tuer : " + weaponsThatCanKill);
    const rankedAvgDmgDesc = arraySort(mapKeys(weaponsThatCanKill), (a, b) => b - a);
    const highestDamageWeapon = weaponsThatCanKill[rankedAvgDmgDesc[0]];

    debug("Best weapon : " + highestDamageWeapon.name);
    debug("C'est CIAO !");
    
    myLeek.changeWeapon(highestDamageWeapon);

    if (myLeek.tp() % highestDamageWeapon.cost >= PROTEIN.cost) {
        useChip(CHIP_PROTEIN);
    }
    
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
}

useChip(CHIP_WARM_UP);

if (turn % 3 == 1) {
	useChip(CHIP_RAGE);
}

if (myLeek.lifePercent() < 30) {
    if (!getCooldown(CHIP_REGENERATION)) {
        useChip(CHIP_REGENERATION);
    } else {
        useChip(CHIP_REMISSION);
        useChip(CHIP_CURE);
    }
}

if (myLeek.lifePercent() < 50) {
    useChip(CHIP_REMISSION);
}

// Liberation if poisoned
if (Effect.getEffectOfType(myLeek.id, EFFECT_POISON)) {
    const poisonAmount: number = Effect.getEffectsOfTypeAmount(myLeek.id, EFFECT_POISON, 2);
    if (poisonAmount > 500 && !getCooldown(CHIP_ANTIDOTE)) {
        useChip(CHIP_ANTIDOTE);
    }
}
if (distanceTo(enemy.id) > 7) {
    if (myLeek.tp() > 9 && !getCooldown(CHIP_KNOWLEDGE) && !getCooldown(CHIP_ARMORING) && (myLeek.lifePercent() > 2 / 3 || Effect.getEffectsOfTypeAmount(myLeek.id, EFFECT_ABSOLUTE_SHIELD) > 150)) {
        useChip(CHIP_KNOWLEDGE);
        useChip(CHIP_ARMORING);
        if (!getCooldown(CHIP_ELEVATION)) {
            useChip(CHIP_ELEVATION);
        }
    }
}

useChip(CHIP_WALL);

if (myLeek.lifePercent() > 75) {
    if (!getCooldown(CHIP_TRANSMUTATION)) {
        useChipOnCell(CHIP_TRANSMUTATION, getCell() - 17);
        useChipOnCell(CHIP_TRANSMUTATION, getCell() - 18);
        useChipOnCell(CHIP_TRANSMUTATION, getCell() + 17);
        useChipOnCell(CHIP_TRANSMUTATION, getCell() + 18);
    }

    // if (!getCooldown(CHIP_MUTATION)) {
    //     useChip(CHIP_MUTATION);
    // }
}

if (distanceTo(enemy.id) in [...Array(12).keys()] && myLeek.tp() > 10) {
    useChip(CHIP_MOTIVATION);
    useChip(CHIP_PROTEIN);
    useChip(CHIP_STEROID);
}

if (Effect.getEffectsOfTypeAmount(enemy.id, EFFECT_ABSOLUTE_SHIELD, 2) > 150 || Effect.getEffectsOfTypeAmount(enemy.id, EFFECT_RELATIVE_SHIELD, 2) > 30) {
    LIBERATION.moveAndUse();
}

const cell: Cell | null = M_LASER.canMoveToUse();

if (cell && myLeek.tp() > M_LASER.cost) {
    myLeek.changeWeapon(M_LASER);
    
    moveTowardCell(cell.number);

    useWeapon(enemy.id);
    useWeapon(enemy.id);
    useWeapon(enemy.id);
}

if(pathDistanceBetween(myLeek.id, enemy.id) <= myLeek.mp()) {
    myLeek.changeWeapon(AXE);

    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
} else {
    STALACTITE.moveAndUse();
    ROCKFALL.moveAndUse();
    moveToward(enemy.id);
}

const rhinoCell: Cell | null = RHINO.canMoveToUse();

if (
    rhinoCell &&
    (
        myLeek.weapon != RHINO && myLeek.tp() > RHINO.cost
        ||
        myLeek.weapon == RHINO && myLeek.tp() >= RHINO.cost
    )
    ) {
    const rhinoDamage: Damage = RHINO.getWeaponDamage();

    if (rhinoDamage.strengthAvg > 150 || myLeek.lifePercent() > 75) {
        myLeek.changeWeapon(RHINO);
        myLeek.moveAndAttack();
        myLeek.attack();
        myLeek.attack();
        myLeek.attack();
        myLeek.attack();
        myLeek.attack();
    }
}

if (enemy.isDead()) {
    searchEnemy();
    if (distanceTo(enemy.id) <= myLeek.mp()) {
        moveToward(enemy.id);
    }
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
} else if (myLeek.tp() > 4) {
    var other = getNearestEnemy();
    STALACTITE.moveAndUse(myLeek.id, other);
    ROCKFALL.moveAndUse(myLeek.id, other);
    myLeek.moveAndAttack(other);
    myLeek.attack(other);
    myLeek.attack(other);
    myLeek.attack(other);
}

if (myLeek.lifePercent() < 80) {
    useChip(CHIP_REMISSION);
    useChip(CHIP_CURE);
}

if (enemy.strength() > 250) {
    useChip(CHIP_MIRROR);
}

moveToward(enemy.id);

useChip(CHIP_SERUM);
useChip(CHIP_CURE);
useChip(CHIP_COVETOUSNESS, enemy.id);