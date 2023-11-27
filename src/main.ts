import { LS } from "./globaux/ls";
import { ICEBERG, LIBERATION, PROTEIN, ROCKFALL, STALACTITE } from "./common/data/chips";
import { enemy, myLeek, searchEnemy } from "./common/vars";
import { Effect } from "./common/class/effect";
import { Move } from "./common/class/move";
import { distanceTo, pathDistanceBetween } from "./common/utils";
import { AXE, BAZOOKA } from "./common/data/weapons";
import { Damage } from "./common/class/damage";
import { Cell } from "./common/class/cell";

/*
 * Stat : 200 agility, 400 strength, 5 MP, 18 TP, 200 resistance and 200 wisdom then full HP
 * Chips :  wall, fortress, shield, armor, motiv, adrenaline, solidification/antidote, steroid, protein, liberation, regen, stalactite, iceberg, rockfall, armoring, serum
 * Weapons : unstable destroyer, axe, bazooka, rhino
 */

if (distanceTo(enemy.id) > myLeek.mp() || enemy.life() > 1200) {
    LS.useChip(LS.CHIP_WARM_UP);
}

LS.useChip(LS.CHIP_ADRENALINE);

// Test if can kill with any weapon
for (const weapon of myLeek.weapons) {

    let currentTP: number = myLeek.tp();

    if (myLeek.weapon !== weapon) {
        currentTP--;
    }

    const nbUses: number = LS.floor(currentTP / weapon.cost);

    const canUseProtein: boolean = currentTP % weapon.cost >= PROTEIN.cost && !LS.getCooldown(LS.CHIP_PROTEIN);

    const canMove: Cell | null = weapon.canMoveToUse();

    if (!canMove) continue;

    if (canUseProtein) {
        LS.useChip(LS.CHIP_PROTEIN);
    }

    const weaponDmg: Damage = weapon.getWeaponDamage();

    LS.debug("Nombres de tirs : " + nbUses);
    LS.debug("Dégats min : " + weaponDmg.strengthMin);
    LS.debug("Dégats avg : " + weaponDmg.strengthAvg);
    LS.debug("Dégats max : " + weaponDmg.strengthMax);
    LS.debug("Total min : " + nbUses * weaponDmg.strengthMin);
    LS.debug("Total avg : " + nbUses * weaponDmg.strengthAvg);
    LS.debug("Total max : " + nbUses * weaponDmg.strengthMax);

    const canKill: boolean = enemy.life() <= weaponDmg.strengthAvg * nbUses;

    if (canKill) {
        LS.debug("C'est CIAO !");

        myLeek.changeWeapon(weapon);

        while (myLeek.tp() >= weapon.cost && !enemy.isDead()) {
            myLeek.moveAndAttack()
        }
        break;
    }
}

LS.useChip(LS.CHIP_WARM_UP);

if (myLeek.lifePercent() < 25) {
    LS.useChip(LS.CHIP_REMISSION);
}

if (myLeek.lifePercent() < 25) {
    if (!LS.getCooldown(LS.CHIP_REGENERATION)) {
        LS.useChip(LS.CHIP_REGENERATION);
    } else {
        LS.useChip(LS.CHIP_WARM_UP);
        LS.useChip(LS.CHIP_SERUM);
        Move.hide(false);
    }
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

if (distanceTo(enemy.id) < 20 && enemy.strength() > 149) {
    LS.useChip(LS.CHIP_WALL);
    LS.useChip(LS.CHIP_SHIELD);
    LS.useChip(LS.CHIP_ARMOR);
    LS.useChip(LS.CHIP_FORTRESS);
}

if (distanceTo(enemy.id) in [...Array(10).keys()] && myLeek.tp() > 10) {
    LS.useChip(LS.CHIP_MOTIVATION);
    LS.useChip(LS.CHIP_PROTEIN);
    LS.useChip(LS.CHIP_STEROID);
}

myLeek.changeWeapon(AXE);

if (Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_ABSOLUTE_SHIELD, 2) > 100 && Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_RELATIVE_SHIELD, 2) > 20) {
    LIBERATION.moveAndUse();
}

if(pathDistanceBetween(myLeek.id, enemy.id) <= myLeek.mp()) {
    myLeek.moveAndAttack();
    myLeek.attack();
    myLeek.attack();
} else {
    ICEBERG.moveAndUse();
    STALACTITE.moveAndUse();
    ROCKFALL.moveAndUse();
    Move.hideToward();
}

if (pathDistanceBetween(myLeek.id, enemy.id) > myLeek.mp()) {
    Move.hideToward();
} else {
    LS.moveToward(enemy.id);
}

LS.useChip(LS.CHIP_SERUM);

const cell: Cell | null = BAZOOKA.canMoveToUse();

if (cell && myLeek.tp() > BAZOOKA.cost) {
    myLeek.changeWeapon(BAZOOKA);

    LS.useWeaponOnCell(cell.number);
    LS.useWeaponOnCell(cell.number);

    myLeek.changeWeapon(AXE);
}

if (enemy.isDead()) {
    searchEnemy();
    if (distanceTo(enemy.id) <= myLeek.mp()) {
        LS.moveToward(enemy.id);
    }
    myLeek.moveAndAttack();
    myLeek.attack();
    Move.hideToward();
} else if (myLeek.tp() > 4) {
    var other = LS.getNearestEnemy();
    ICEBERG.moveAndUse(myLeek.id, other);
    STALACTITE.moveAndUse(myLeek.id, other);
    ROCKFALL.moveAndUse(myLeek.id, other);
    myLeek.moveAndAttack(other);
}
