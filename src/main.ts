import { LS } from "./globaux/ls";
import { enemy, myLeek, searchEnemy } from "./common/vars";
import { Effect } from "./common/class/effect";
import { Move } from "./common/class/move";
import { distanceTo, pathDistanceBetween } from "./common/utils";
import { Damage } from "./common/class/damage";
import { Cell } from "./common/class/cell";
import { Weapon } from "./common/class/item/weapon";
import { AXE, BAZOOKA, RHINO } from "./common/data/weapons";
import { ICEBERG, LIBERATION, PROTEIN, ROCKFALL, STALACTITE } from "./common/data/chips";

/*
 * Stat : 200 agility, 400 strength, 5 MP, 18 TP, 200 resistance and 200 wisdom then full HP
 * Chips :  wall, fortress, shield, armor, motiv, adrenaline, solidification/antidote, steroid, protein, liberation, regen, stalactite, iceberg, rockfall, armoring, serum
 * Weapons : unstable destroyer, axe, bazooka, rhino
 */

if (distanceTo(enemy.id) > myLeek.mp() || enemy.life() > 1200) {
    LS.useChip(LS.CHIP_WARM_UP);
}

LS.setWeapon(myLeek.weapon.id);

LS.useChip(LS.CHIP_ADRENALINE);

let weaponsThatCanKill = new Map<number, Weapon>();

// Test if can kill with any weapon
for (const weapon of myLeek.weapons) {
    let currentTP: number = myLeek.tp();

    if (myLeek.weapon !== weapon) {
        currentTP--;
    }

    const nbUses: number = LS.floor(currentTP / weapon.cost);

    const canMove: Cell | null = weapon.canMoveToUse();

    if (!canMove) continue;

    const weaponDmg: Damage = weapon.getWeaponDamage();

    LS.debug("--------------------------");
    LS.debug("Arme : " + weapon.name);
    LS.debug("Nombres de tirs : " + nbUses);
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
        PROTEIN.use();
    }
    
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
    myLeek.attack();
}

LS.useChip(LS.CHIP_WARM_UP);


if (myLeek.lifePercent() < 25) {
    if (!LS.getCooldown(LS.CHIP_REGENERATION)) {
        LS.useChip(LS.CHIP_REGENERATION);
    } else {
        LS.useChip(LS.CHIP_WARM_UP);
        LS.useChip(LS.CHIP_SERUM);
        Move.hide(false);
    }
}

if (myLeek.lifePercent() < 50) {
    LS.useChip(LS.CHIP_REMISSION);
}

// Liberation if poisoned
if (Effect.getEffectOfType(myLeek.id, LS.EFFECT_POISON)) {
    const poisonAmount: number = Effect.getEffectsOfTypeAmount(myLeek.id, LS.EFFECT_POISON, 2);
    if (poisonAmount > 250) {
        if (LS.getCooldown(LS.CHIP_ANTIDOTE)) {
            LS.useChip(LS.CHIP_LIBERATION);
        }
        LS.useChip(LS.CHIP_ANTIDOTE);
    }
}
if (distanceTo(enemy.id) > 7) {
    if (myLeek.tp() > 9 && !LS.getCooldown(LS.CHIP_KNOWLEDGE) && !LS.getCooldown(LS.CHIP_ARMORING) && (myLeek.lifePercent() > 2 / 3 || Effect.getEffectsOfTypeAmount(myLeek.id, LS.EFFECT_ABSOLUTE_SHIELD) > 99)) {
        LS.useChip(LS.CHIP_KNOWLEDGE);
        LS.useChip(LS.CHIP_ARMORING);
    }
}

if (distanceTo(enemy.id) < 20 && enemy.strength() > 149 && !(pathDistanceBetween(myLeek.id, enemy.id) <= myLeek.mp() && myLeek.lifePercent() > 85)) {
    LS.useChip(LS.CHIP_WALL);
    LS.useChip(LS.CHIP_SHIELD);
    if (LS.getCooldown(LS.CHIP_LIBERATION, enemy.id)) {
        LS.useChip(LS.CHIP_ARMOR);
        LS.useChip(LS.CHIP_FORTRESS);
    }
}

if (distanceTo(enemy.id) in [...Array(10).keys()] && myLeek.tp() > 10) {
    LS.useChip(LS.CHIP_MOTIVATION);
    LS.useChip(LS.CHIP_PROTEIN);

    if (LS.getCooldown(LS.CHIP_LIBERATION, enemy.id)) {
        LS.useChip(LS.CHIP_STEROID);
    }
}

if(myLeek.lifePercent() <= 75) {
    myLeek.changeWeapon(AXE);
}

if (Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_ABSOLUTE_SHIELD, 2) > 100 || Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_RELATIVE_SHIELD, 2) > 20) {
    LIBERATION.moveAndUse();
}

const cell: Cell | null = BAZOOKA.canMoveToUse();

if (cell && myLeek.tp() > BAZOOKA.cost) {
    myLeek.changeWeapon(BAZOOKA);
    
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
    ICEBERG.moveAndUse();
    STALACTITE.moveAndUse();
    ROCKFALL.moveAndUse();
    Move.hideToward();
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
    Move.hideToward();
} else if (myLeek.tp() > 4) {
    var other = LS.getNearestEnemy();
    ICEBERG.moveAndUse(myLeek.id, other);
    STALACTITE.moveAndUse(myLeek.id, other);
    ROCKFALL.moveAndUse(myLeek.id, other);
    myLeek.moveAndAttack(other);
}

if (myLeek.lifePercent() < 100) {
    LS.useChip(LS.CHIP_REMISSION);
}

LS.moveToward(enemy.id);

LS.useChip(LS.CHIP_SERUM);
LS.useChip(LS.CHIP_COVETOUSNESS, enemy.id);