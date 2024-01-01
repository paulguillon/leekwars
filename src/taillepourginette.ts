import { LS } from "./globaux/ls";
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
    LS.useChip(LS.CHIP_WARM_UP);
}

if (!LS.getWeapon()) {
    myLeek.changeWeapon(M_LASER);
}

LS.useChip(LS.CHIP_ADRENALINE);

let weaponsThatCanKill = new Map<number, Weapon>();

// Test if can kill with any weapon
for (const weapon of myLeek.weapons) {
    let currentTP: number = myLeek.tp();

    if (myLeek.weapon !== weapon) {
        currentTP--;
    }

    const nbUses: number = LS.floor(currentTP / weapon.cost);
    currentTP -= nbUses * weapon.cost;

    // TODO rework canmovetouse
    var cellsToUse = LS.arrayMap(LS.getCellsToUseWeapon(weapon.id, enemy.id), c => field[c]);
    var closest = Cell.getClosestCellPathTo(cellsToUse, myLeek.id);

    LS.debug("--------------------------");
    LS.debug(weapon.name);
    LS.debug("Nb uses : " + nbUses);
    LS.debug("PA utilisés : " + (myLeek.tp() - currentTP));
    LS.debug("PA restants : " + currentTP);
    
    const canMove: Cell | null = (closest && LS.getPathLength(closest.number, LS.getCell()) < myLeek.mp()) ? closest : null;

    if (!canMove) continue;

    const weaponDmg: Damage = weapon.getWeaponDamage();

    LS.debug("Dégats avg : " + weaponDmg.strengthAvg);
    LS.debug("Total avg : " + nbUses * weaponDmg.strengthAvg);

    const canKill: boolean = enemy.life() <= weaponDmg.strengthAvg * nbUses;

    if (canKill) {
        weaponsThatCanKill[weaponDmg.totalAvg * nbUses] = weapon;
    }
}

if (!LS.mapIsEmpty(weaponsThatCanKill)) {
    LS.debug("Les armes qui peuvent tuer : " + weaponsThatCanKill);
    const rankedAvgDmgDesc = LS.arraySort(LS.mapKeys(weaponsThatCanKill), (a, b) => b - a);
    const highestDamageWeapon = weaponsThatCanKill[rankedAvgDmgDesc[0]];

    LS.debug("Best weapon : " + highestDamageWeapon.name);
    LS.debug("C'est CIAO !");
    
    myLeek.changeWeapon(highestDamageWeapon);

    if (myLeek.tp() % highestDamageWeapon.cost >= PROTEIN.cost) {
        LS.useChip(LS.CHIP_PROTEIN);
    }
    
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
}

LS.useChip(LS.CHIP_WARM_UP);

if (turn % 3 == 1) {
	LS.useChip(LS.CHIP_RAGE);
}

if (myLeek.lifePercent() < 30) {
    if (!LS.getCooldown(LS.CHIP_REGENERATION)) {
        LS.useChip(LS.CHIP_REGENERATION);
    } else {
        LS.useChip(LS.CHIP_REMISSION);
        LS.useChip(LS.CHIP_CURE);
    }
}

if (myLeek.lifePercent() < 50) {
    LS.useChip(LS.CHIP_REMISSION);
}

// Liberation if poisoned
if (Effect.getEffectOfType(myLeek.id, LS.EFFECT_POISON)) {
    const poisonAmount: number = Effect.getEffectsOfTypeAmount(myLeek.id, LS.EFFECT_POISON, 2);
    if (poisonAmount > 500 && !LS.getCooldown(LS.CHIP_ANTIDOTE)) {
        LS.useChip(LS.CHIP_ANTIDOTE);
    }
}
if (distanceTo(enemy.id) > 7) {
    if (myLeek.tp() > 9 && !LS.getCooldown(LS.CHIP_KNOWLEDGE) && !LS.getCooldown(LS.CHIP_ARMORING) && (myLeek.lifePercent() > 2 / 3 || Effect.getEffectsOfTypeAmount(myLeek.id, LS.EFFECT_ABSOLUTE_SHIELD) > 150)) {
        LS.useChip(LS.CHIP_KNOWLEDGE);
        LS.useChip(LS.CHIP_ARMORING);
        if (!LS.getCooldown(LS.CHIP_ELEVATION)) {
            LS.useChip(LS.CHIP_ELEVATION);
        }
    }
}
if (myLeek.lifePercent() > 75) {
    if (!LS.getCooldown(LS.CHIP_TRANSMUTATION)) {
        LS.useChipOnCell(LS.CHIP_TRANSMUTATION, LS.getCell() - 17);
        LS.useChipOnCell(LS.CHIP_TRANSMUTATION, LS.getCell() - 18);
        LS.useChipOnCell(LS.CHIP_TRANSMUTATION, LS.getCell() + 17);
        LS.useChipOnCell(LS.CHIP_TRANSMUTATION, LS.getCell() + 18);
    }

    if (!LS.getCooldown(LS.CHIP_MUTATION)) {
        LS.useChip(LS.CHIP_MUTATION);
    }
}

if (distanceTo(enemy.id) in [...Array(12).keys()] && myLeek.tp() > 10) {
    LS.useChip(LS.CHIP_MOTIVATION);
    LS.useChip(LS.CHIP_PROTEIN);
    LS.useChip(LS.CHIP_STEROID);
}

if (Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_ABSOLUTE_SHIELD, 2) > 150 || Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_RELATIVE_SHIELD, 2) > 30) {
    LIBERATION.moveAndUse();
}

const cell: Cell | null = M_LASER.canMoveToUse();

if (cell && myLeek.tp() > M_LASER.cost) {
    myLeek.changeWeapon(M_LASER);
    
    LS.moveTowardCell(cell.number);

    LS.useWeapon(enemy.id);
    LS.useWeapon(enemy.id);
    LS.useWeapon(enemy.id);
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
    LS.moveToward(enemy.id);
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
        LS.moveToward(enemy.id);
    }
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
} else if (myLeek.tp() > 4) {
    var other = LS.getNearestEnemy();
    STALACTITE.moveAndUse(myLeek.id, other);
    ROCKFALL.moveAndUse(myLeek.id, other);
    myLeek.moveAndAttack(other);
    myLeek.attack(other);
    myLeek.attack(other);
    myLeek.attack(other);
}

if (myLeek.lifePercent() < 80) {
    LS.useChip(LS.CHIP_REMISSION);
    LS.useChip(LS.CHIP_CURE);
}

if (enemy.strength() > 250) {
    LS.useChip(LS.CHIP_MIRROR);
}

LS.moveToward(enemy.id);

LS.useChip(LS.CHIP_SERUM);
LS.useChip(LS.CHIP_CURE);
LS.useChip(LS.CHIP_COVETOUSNESS, enemy.id);