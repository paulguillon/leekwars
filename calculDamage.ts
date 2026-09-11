import { Damage } from "class/damage.class.ts";
import { ItemFeature } from "class/item-feature.class.ts";

getChipsDamage(Fight.getNearestEnemy(), Fight.me);

function getChipsDamage(source: Entity, target: Entity): Damage {
    const chips: Chip[] = source.chips;
    const damagingChips: Chip[] = chips.filter((chip: Chip) => {
        const itemFeatures: ItemFeature[] = chip.features
            .map((feature: Feature) => new ItemFeature(feature))
        const isDamagingChip: boolean = itemFeatures
            .some((itemFeature: ItemFeature) =>
                [Effect.DAMAGE, Effect.POISON, Effect.NOVA_DAMAGE].includes(itemFeature.type)
                && itemFeature.onEnemies)

        return isDamagingChip
    });
    Debug.log(`Damaging chips: ${damagingChips.map((chip: Chip) => chip.name).join(", ")}`);
    const chipsDamage: Damage[] = damagingChips.map((chip: Chip) => Damage.getItemDamage(chip, source, target, false));

    const totalChipsDamage: Damage = Damage.addDamages(chipsDamage);
    Debug.log(`strength avg: ${totalChipsDamage.strengthAvg}`);
    Debug.log(`poison avg: ${totalChipsDamage.poisonAvg}`);
    Debug.log(`nova avg: ${totalChipsDamage.novaAvg}`);
    return totalChipsDamage;
}