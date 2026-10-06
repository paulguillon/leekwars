class Damage {
    item: Item
    cost: number
    min: number
    max: number
    avg: number
    minCritical: number
    maxCritical: number
    avgCritical: number
    minByCost: number
    maxByCost: number
    avgByCost: number
    minCriticalByCost: number
    maxCriticalByCost: number
    avgCriticalByCost: number


    static getDamage(item: Item, target: Entity): Damage {
        const dmg: Damage = new Damage();
        dmg.item = item;

        const DAMAGE_FORMULA = (1 + me.strength / 100) * (1 + me.power / 100);

        const features = item.features.filter((f) => f.type === Effect.DAMAGE);
        const nbOfDamageLine: number = features.length;
        const minDamage: number = features.map((f) => f.minValue).reduce((acc, curr) => acc + curr, 0);
        const maxDamage: number = features.map((f) => f.maxValue).reduce((acc, curr) => acc + curr, 0);
        const avgDamage: number = (minDamage + maxDamage) / 2;



        const RELATIVE_SHIELD_FORMULA = (1 - target.relativeShield / 100);
        const ABSOLUTE_SHIELD_FORMULA = target.absoluteShield * nbOfDamageLine;

        dmg.min = Math.max(0, minDamage * DAMAGE_FORMULA * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);
        dmg.max = Math.max(0, maxDamage * DAMAGE_FORMULA * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);
        dmg.avg = Math.max(0, avgDamage * DAMAGE_FORMULA * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);

        const CRITICAL_MULTIPLIER = Fight.CRITICAL_FACTOR
        dmg.minCritical = Math.max(0, minDamage * DAMAGE_FORMULA * CRITICAL_MULTIPLIER * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);
        dmg.maxCritical = Math.max(0, maxDamage * DAMAGE_FORMULA * CRITICAL_MULTIPLIER * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);
        dmg.avgCritical = Math.max(0, avgDamage * DAMAGE_FORMULA * CRITICAL_MULTIPLIER * RELATIVE_SHIELD_FORMULA - ABSOLUTE_SHIELD_FORMULA);

        const switchCost = item instanceof Weapon && me.weapon.id != item.id ? 1 : 0;
        const COST = item.cost + switchCost
        dmg.cost = COST

        dmg.minByCost = dmg.min / COST;
        dmg.maxByCost = dmg.max / COST;
        dmg.avgByCost = dmg.avg / COST;

        dmg.minCriticalByCost = dmg.minCritical / COST;
        dmg.maxCriticalByCost = dmg.maxCritical / COST;
        dmg.avgCriticalByCost = dmg.avgCritical / COST;

        return dmg;
    }
}

const me = Fight.me;

// En chasse aux coffres, on s'éloigne des ennemis.
if (Fight.type == Fight.Type.CHEST_HUNT) {
    me.moveAwayFromEntities(Fight.getEnemies());
}

let enemy = Fight.getNearestEnemy();

const hasShotgun = me.weapons.includes(Weapon.shotgun);
const hasMachineGun = me.weapons.includes(Weapon.machineGun);

const hasChip = (chip: Chip): boolean => me.chips.includes(chip);

// Motivation en début de tour pour profiter de ses PT supplémentaires.
if (
    hasChip(Chip.motivation) &&
    me.life == me.maxLife &&
    me.canUseChip(Chip.motivation, me) &&
    me.tp >= Chip.motivation.cost
) {
    me.useChip(Chip.motivation, me);
}

// Le machine gun sert de référence pour approcher.
if (hasMachineGun && me.weapon !== Weapon.machineGun) {
    me.setWeapon(Weapon.machineGun);
}



const allMyDamagingItems: Item[] = (me.chips as Item[])
    .concat(me.weapons)
    .filter(item => item.features
        .some(f => f.type === Effect.DAMAGE) &&
        (item instanceof Chip ? !(item as Chip).currentCooldown : true)
    )
const itemsDamageSorted = allMyDamagingItems
    .map(item => Damage.getDamage(item, enemy))
    .sort((a, b) => b.avgByCost - a.avgByCost)

for (const itemDamage of itemsDamageSorted) {
    Debug.log(itemDamage.item.name);
    Debug.log('avg : ' + itemDamage.avg.toFixed(1) + ' cost : ' + itemDamage.item.cost + ' | avgByCost : ' + itemDamage.avgByCost.toFixed(1));
}



if (
    hasChip(Chip.leatherBoots) &&
    me.canUseChip(Chip.leatherBoots, me) &&
    me.tp >= Chip.leatherBoots.cost
) {
    me.useChip(Chip.leatherBoots, me);
}

const targetCell = me.weaponCell(enemy);
me.moveToward(targetCell);

// La cible et la distance peuvent avoir changé après le déplacement.
enemy = Fight.getNearestEnemy();

let distance = Field.distance(me.cell, enemy.cell);

const shotgunInRange =
    distance >= Weapon.shotgun.minRange &&
    distance <= Weapon.shotgun.maxRange &&
    (!Weapon.shotgun.needsLos || Field.lineOfSight(me.cell, enemy.cell));

const machineGunInRange =
    distance >= Weapon.machineGun.minRange &&
    distance <= Weapon.machineGun.maxRange &&
    (!Weapon.machineGun.needsLos || Field.lineOfSight(me.cell, enemy.cell));

// Le changement d'arme coûte 1 PT.
// On ne lance la combo que si les deux tirs et les changements sont finançables.
const costToShotgun =
    me.weapon === Weapon.shotgun ? 0 : 1;

const comboCost =
    costToShotgun +
    Weapon.shotgun.cost +
    1 +
    Weapon.machineGun.cost;

let usedShotgunCombo = false;

if (
    hasShotgun &&
    hasMachineGun &&
    shotgunInRange &&
    machineGunInRange &&
    me.tp >= comboCost
) {
    if (me.weapon !== Weapon.shotgun) {
        me.setWeapon(Weapon.shotgun);
    }

    if (me.canUseWeapon(enemy)) {
        me.useWeapon(enemy);
    }

    // Le fusil à pompe réduit l'armure absolue.
    // Le machine gun enchaîne ses impacts pendant que la vulnérabilité agit.
    enemy = Fight.getNearestEnemy();

    if (enemy.alive) {
        if (me.weapon !== Weapon.machineGun) {
            me.setWeapon(Weapon.machineGun);
        }

        if (me.canUseWeapon(enemy) && me.tp >= Weapon.machineGun.cost) {
            me.useWeapon(enemy);
            usedShotgunCombo = true;
        }
    }
}

// Si la combo complète n'est pas possible, on garde le machine gun
// dès qu'il peut tirer et que les PT suffisent.
if (!usedShotgunCombo && hasMachineGun) {
    enemy = Fight.getNearestEnemy();

    const switchCost = me.weapon === Weapon.machineGun ? 0 : 1;

    if (
        me.canUseWeapon(enemy) ||
        machineGunInRange
    ) {
        if (me.weapon !== Weapon.machineGun && me.tp >= switchCost + Weapon.machineGun.cost) {
            me.setWeapon(Weapon.machineGun);
        }

        if (me.weapon === Weapon.machineGun && me.canUseWeapon(enemy)) {
            for (let i = 0; i < 4; i++) {
                if (me.tp >= Weapon.machineGun.cost && me.canUseWeapon(enemy)) {
                    me.useWeapon(enemy);
                }
            }
        }
    }
}

// Buffs si les puces sont équipées et utilisables.
if (hasChip(Chip.protein) && me.canUseChip(Chip.protein, me) && me.tp >= Chip.protein.cost) {
    me.useChip(Chip.protein, me);
}

if (hasChip(Chip.helmet) && me.canUseChip(Chip.helmet, me) && me.tp >= Chip.helmet.cost) {
    me.useChip(Chip.helmet, me);
}

// Les puces de dégâts passent après la combo d'armes.
enemy = Fight.getNearestEnemy();
distance = Field.distance(me.cell, enemy.cell);

if (
    hasChip(Chip.rock) &&
    me.canUseChip(Chip.rock, enemy) &&
    me.tp >= Chip.rock.cost
) {
    me.useChip(Chip.rock, enemy);
}

if (
    hasChip(Chip.flash) &&
    distance > 1 &&
    me.canUseChip(Chip.flash, enemy) &&
    me.tp >= Chip.flash.cost
) {
    me.useChip(Chip.flash, enemy);
}

if (hasChip(Chip.flame)) {
    for (let i = 0; i < Chip.flame.maxUses; i++) {
        if (me.canUseChip(Chip.flame, enemy) && me.tp >= Chip.flame.cost) {
            me.useChip(Chip.flame, enemy);
        }
    }
}

if (
    hasChip(Chip.ice) &&
    me.canUseChip(Chip.ice, enemy) &&
    me.tp >= Chip.ice.cost
) {
    me.useChip(Chip.ice, enemy);
}

if (
    hasChip(Chip.pebble) &&
    me.canUseChip(Chip.pebble, enemy) &&
    me.tp >= Chip.pebble.cost
) {
    me.useChip(Chip.pebble, enemy);
}

if (hasChip(Chip.spark)) {
    for (let i = 0; i < 5; i++) {
        if (me.canUseChip(Chip.spark, enemy) && me.tp >= Chip.spark.cost) {
            me.useChip(Chip.spark, enemy);
        }
    }
}

// Soin en dernier, si Guérison est équipée et utilisable.
if (
    hasChip(Chip.cure) &&
    me.life < me.maxLife &&
    me.canUseChip(Chip.cure, me) &&
    me.tp >= Chip.cure.cost
) {
    me.useChip(Chip.cure, me);
}