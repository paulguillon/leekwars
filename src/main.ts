import 'bulbs/puny';
import {LS} from './globaux/ls';
import { Effect } from './common/class/effect';
import { Move } from './common/class/move';
import {distanceTo, pathDistanceBetween} from "./common/utils";
import {enemy, myLeek, searchEnemy, turn} from "./common/vars";
import { chips } from './common/data/chips';
import { weapons } from './common/data/weapons';

/*
 * Stat : 200 agility, 300 strength, 5 MP, 15 TP, 100 resistance and 200 wisdom then full HP
 * Chips :  wall, shield, armor, motiv, warm up, solidification, steroid, protein, liberation/antidote/adrenaline, regen, stalactite, iceberg, rockfall, armoring, knowledge, helmet, vaccine
 * Weapons : unstable destroyer, axe, grenade launcher
 */

if (turn == 1) {
	LS.setWeapon(LS.WEAPON_AXE);
}

LS.useChip(LS.CHIP_ADRENALINE);

if (LS.getTP() > 17) {
    if (distanceTo(enemy.id) <= LS.getMP() + 1) {
        LS.moveToward(enemy.id);
        LS.useWeapon(enemy.id);
        LS.useWeapon(enemy.id);
        LS.useWeapon(enemy.id);
    } else {
        chips[LS.CHIP_STALACTITE].moveAndUse();
        chips[LS.CHIP_ROCKFALL].moveAndUse();
        chips[LS.CHIP_ICEBERG].moveAndUse();
    }
}

// If enemy low life
// Attack twice at 50 avg base dmg * strength * power * relative - absolute
const minDmg: boolean = LS.getLife(enemy.id) <= (LS.getTP() - LS.getTP() % 6) / 6 * 55 * (LS.getStrength() + ((!LS.getCooldown(LS.CHIP_PROTEIN) && LS.getTP() % 6 > 2) ? 80 : 0) / 100 + 1) * (LS.getPower() / 100 + 1) * (1 - LS.getRelativeShield(enemy.id) / 100) - LS.getAbsoluteShield(enemy.id);
if (minDmg && LS.getWeapon() && LS.getTP() > 5 && pathDistanceBetween(myLeek.id, enemy.id) <= LS.getMP()) {
    LS.debug("C'est CIAO !")

    LS.moveToward(enemy.id);

    LS.useChip(LS.CHIP_PROTEIN);

    while (LS.getTP() > 5 && !LS.isDead(enemy.id)) {
        LS.useWeapon(enemy.id);
    }
}

if (LS.getLife() < LS.getTotalLife() / 4) {
    if (!LS.getCooldown(LS.CHIP_REGENERATION)) {
        LS.useChip(LS.CHIP_REGENERATION);
    } else {
        LS.useChip(LS.CHIP_WARM_UP);
        LS.useChip(LS.CHIP_VACCINE);
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
    LS.useChip(LS.CHIP_WARM_UP);
}

if (distanceTo(enemy.id) < 17 && LS.getStrength(enemy.id) > 149) {
    if (distanceTo(enemy.id) > 5) {
        LS.useChip(LS.CHIP_SOLIDIFICATION);
    }
    LS.useChip(LS.CHIP_ARMOR);
    LS.useChip(LS.CHIP_SHIELD);
    LS.useChip(LS.CHIP_WALL);
    LS.useChip(LS.CHIP_HELMET);
}

if (distanceTo(enemy.id) in [...Array(10).keys()] && LS.getTP() > 10) {
    LS.useChip(LS.CHIP_MOTIVATION);
    LS.useChip(LS.CHIP_PROTEIN);
    LS.useChip(LS.CHIP_STEROID);
}

if (LS.getAbsoluteShield(enemy.id) < 100 || LS.getMagic(enemy.id) > 149) {
    if (distanceTo(enemy.id) <= LS.getMP() + 1) {
        LS.moveToward(enemy.id);
        LS.useWeapon(enemy.id);
        LS.useWeapon(enemy.id);
    }
}

LS.useChip(LS.CHIP_VACCINE);

if (distanceTo(enemy.id) > 1) {
    Move.hideToward();
}

if (LS.getTP() > 9 && Effect.getEffectsOfTypeAmount(enemy.id, LS.EFFECT_ABSOLUTE_SHIELD, 2) > 100 && LS.canUseChip(LS.CHIP_LIBERATION, enemy.id)) {
    chips[LS.CHIP_LIBERATION].moveAndUse();
}

if (LS.getTP() > 4) {
    chips[LS.CHIP_STALACTITE].moveAndUse();
    chips[LS.CHIP_ROCKFALL].moveAndUse();
    chips[LS.CHIP_ICEBERG].moveAndUse();
}

var cell = weapons[LS.WEAPON_GRENADE_LAUNCHER].canMoveToUse();

if (cell && LS.getTP() % 6 == 2 && LS.getTP() > 7) {
    LS.setWeapon(LS.WEAPON_GRENADE_LAUNCHER);

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
    chips[LS.CHIP_STALACTITE].moveAndUse(myLeek.id, other);
    chips[LS.CHIP_ROCKFALL].moveAndUse(myLeek.id, other);
    chips[LS.CHIP_ICEBERG].moveAndUse(myLeek.id, other);
    LS.useWeapon(other);
}
