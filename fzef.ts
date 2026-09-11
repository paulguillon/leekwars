import { Damage } from "./class/damage.class.ts";

function turn() {
    getChipsDamage(Fight.getNearestEnemy(), Fight.me);
}

function getChipsDamage(source: Entity, target: Entity): Damage {
    const chips: Chip[] = source.chips;
    const damagingChips: Chip[] = chips.filter((chip: Chip) => chip.features.some((feature: Feature) => [Effect.DAMAGE, Effect.POISON, Effect.NOVA_DAMAGE].includes(feature.type)));
    Debug.log(`Damaging chips: ${damagingChips.map((chip: Chip) => chip.name).join(", ")}`);
    const chipsDamage: Damage[] = damagingChips.map((chip: Chip) => Damage.getItemDamage(chip, source, target, false));

    const totalChipsDamage: Damage = Damage.addDamages(chipsDamage);
    Debug.log(`strength avg: ${totalChipsDamage.strengthAvg}`);
    Debug.log(`poison avg: ${totalChipsDamage.poisonAvg}`);
    Debug.log(`nova avg: ${totalChipsDamage.novaAvg}`);
    return totalChipsDamage;
}