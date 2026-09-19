if (Fight.type === Fight.Type.CHEST_HUNT) {


    Fight.me.useChip(Chip.warmUp)
    Fight.me.useChip(Chip.rage)
    Fight.me.useChip(Chip.adrenaline)
    Fight.me.useChip(Chip.armor)
    Fight.me.useChip(Chip.shield)
    Fight.me.useChip(Chip.fortress)
    Fight.me.useChip(Chip.mirror)
    Fight.me.useChip(Chip.wall)
    Fight.me.useChip(Chip.knowledge)
    Fight.me.useChip(Chip.elevation)
    Fight.me.useChip(Chip.serum)
    Fight.me.useChip(Chip.vaccine)
    Fight.me.useChip(Chip.armoring)
    Fight.me.useChip(Chip.bandage)
    Fight.me.useChip(Chip.transmutation, Fight.me.cell.id + 18)
    Fight.me.useChip(Chip.covetousness)
    Fight.me.useChip(Chip.antidote)
    Fight.me.moveAwayFrom(Fight.getEnemies().find(e => e.entityType === Entity.Type.CHEST)!);
}