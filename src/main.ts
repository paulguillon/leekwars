import { LS } from "./globaux/ls";
import { Effect } from "./common/class/effect";
import { Move } from "./common/class/move";
import { distanceTo, pathDistanceBetween } from "./common/utils";
import { enemy, myLeek, searchEnemy } from "./common/vars";
import { ICEBERG, LIBERATION, PROTEIN, ROCKFALL, STALACTITE } from "./common/data/chips";
import { AXE, BAZOOKA } from "./common/data/weapons";
import { Damage } from "./common/class/damage";

/*
 * Stat : 200 agility, 400 strength, 5 MP, 18 TP, 200 resistance and 200 wisdom then full HP
 * Chips :  wall, fortress, shield, armor, motiv, adrenaline, solidification/antidote, steroid, protein, liberation, regen, stalactite, iceberg, rockfall, armoring, serum
 * Weapons : unstable destroyer, axe, bazooka, rhino
 */

if (distanceTo(enemy.id) > LS.getMP() || LS.getLife(enemy.id) > 1200) {
    LS.useChip(LS.CHIP_WARM_UP);
}

LS.useChip(LS.CHIP_ADRENALINE);

let currentTP: number = LS.getTP();

if (LS.getWeapon() !== LS.WEAPON_AXE) {
    currentTP--;
}

const nbUses: number = LS.floor(currentTP / AXE.cost);

const canUseProtein: boolean = currentTP % AXE.cost >= PROTEIN.cost && !LS.getCooldown(LS.CHIP_PROTEIN);

const dist: boolean = pathDistanceBetween(myLeek.id, enemy.id) <= LS.getMP();

if (canUseProtein && dist) {
    LS.useChip(LS.CHIP_PROTEIN);
}
const axeDmg: Damage = AXE.getWeaponDamage();

LS.debug("Nombres de cac : " + nbUses);
LS.debug("Dégats min : " + axeDmg.strengthMin);
LS.debug("Dégats avg : " + axeDmg.strengthAvg);
LS.debug("Dégats max : " + axeDmg.strengthMax);
LS.debug("Total min : " + nbUses * axeDmg.strengthMin);
LS.debug("Total avg : " + nbUses * axeDmg.strengthAvg);
LS.debug("Total max : " + nbUses * axeDmg.strengthMax);

const canKill: boolean = LS.getLife(enemy.id) <= axeDmg.strengthAvg * nbUses;

if (canKill && dist) {
    LS.debug("C'est CIAO !");

    LS.moveToward(enemy.id);

    if (LS.getWeapon() != LS.WEAPON_AXE) {
        LS.setWeapon(LS.WEAPON_AXE);
    }

    while (LS.getTP() > 5 && !LS.isDead(enemy.id)) {
        LS.useWeapon(enemy.id);
    }
}

LS.useChip(LS.CHIP_WARM_UP);

if (LS.getLife() < LS.getTotalLife() / 4) {
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
    if (LS.getTP() > 9 && !LS.getCooldown(LS.CHIP_KNOWLEDGE) && !LS.getCooldown(LS.CHIP_ARMORING) && (LS.getLife() > LS.getTotalLife() * 3 / 4 || Effect.getEffectsOfTypeAmount(myLeek.id, LS.EFFECT_ABSOLUTE_SHIELD) > 99)) {
        LS.useChip(LS.CHIP_KNOWLEDGE);
        LS.useChip(LS.CHIP_ARMORING);
    }
}

LS.useChip(LS.CHIP_SOLIDIFICATION);

if (distanceTo(enemy.id) < 20 && LS.getStrength(enemy.id) > 149) {
    LS.useChip(LS.CHIP_ARMOR);
    LS.useChip(LS.CHIP_SHIELD);
    LS.useChip(LS.CHIP_WALL);
}

if (distanceTo(enemy.id) in [...Array(10).keys()] && LS.getTP() > 10) {
    LS.useChip(LS.CHIP_MOTIVATION);
    LS.useChip(LS.CHIP_PROTEIN);
    LS.useChip(LS.CHIP_STEROID);
}

if (!LS.getWeapon()) {
    LS.setWeapon(LS.WEAPON_AXE);
}

if (LS.getTP() > 9 && Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_ABSOLUTE_SHIELD, 2) > 100) {
    LIBERATION.moveAndUse();
}

if (pathDistanceBetween(myLeek.id, enemy.id) > LS.getMP()) {
    Move.hideToward();
} else {
    LS.moveToward(enemy.id);
}

if (LS.getTP() > 6) {
    ICEBERG.moveAndUse();
}
if (LS.getTP() > 5) {
    STALACTITE.moveAndUse();
}
if (LS.getTP() > 4) {
    ROCKFALL.moveAndUse();
}

Move.hideToward();
LS.useWeapon(enemy.id);
LS.useWeapon(enemy.id);
LS.useWeapon(enemy.id);

LS.useChip(LS.CHIP_SERUM);

var cell = BAZOOKA.canMoveToUse();

if (cell && LS.getTP() % 6 == 2 && LS.getTP() > 7) {
    LS.setWeapon(LS.WEAPON_BAZOOKA);

    LS.useWeaponOnCell(cell.number);
    LS.useWeaponOnCell(cell.number);

    LS.setWeapon(LS.WEAPON_AXE);
}

if (LS.isDead(enemy.id)) {
    searchEnemy();
    if (distanceTo(enemy.id) <= LS.getMP()) {
        LS.moveToward(enemy.id);
    }
    LS.useWeapon(enemy.id);
    LS.moveToward(enemy.id);
} else if (LS.getTP() > 4) {
    var other = LS.getNearestEnemy();
    ICEBERG.moveAndUse(myLeek.id, other);
    STALACTITE.moveAndUse(myLeek.id, other);
    ROCKFALL.moveAndUse(myLeek.id, other);
    LS.useWeapon(other);
}
