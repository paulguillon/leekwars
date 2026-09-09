function turn() {
    const me: Me = Fight.me
    const enemy: Entity = Fight.getNearestEnemy()
    me.useChip(Chip.warmUp)
    me.useChip(Chip.knowledge)
    me.useChip(Chip.elevation)
    me.useChip(Chip.armoring)
    me.useChip(Chip.fortress)
    me.moveToward(enemy)

    me.weapons.forEach(weapon => {
        const isCurrent: boolean = weapon === me.weapon
        const enoughTp: boolean = isCurrent ? me.tp >= weapon.cost : me.tp >= weapon.cost + 1
        if (enoughTp && me.canUseWeaponOnCell(enemy, weapon)) {
            const maxNumberOfUses = Math.min(weapon.maxUses, Math.floor((isCurrent ? me.tp : me.tp - 1) / weapon.cost))
            const tpLeft = (isCurrent ? me.tp : me.tp - 1) - maxNumberOfUses * weapon.cost
            console.log("Name : " + weapon.name)
            console.log("max uses " + maxNumberOfUses)
            console.log("left " + tpLeft)
        }
    })
}