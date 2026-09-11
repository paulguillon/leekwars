export class Damage {
    strengthMin: number = 0;
    strengthMax: number = 0;
    strengthAvg: number = 0;
    strengthMinByTP: number = 0;
    strengthMaxByTP: number = 0;
    strengthAvgByTP: number = 0;
    poisonMin: number = 0;
    poisonMax: number = 0;
    poisonAvg: number = 0;
    poisonMinByTP: number = 0;
    poisonMaxByTP: number = 0;
    poisonAvgByTP: number = 0;
    novaMin: number = 0;
    novaMax: number = 0;
    novaAvg: number = 0;
    novaMinByTP: number = 0;
    novaMaxByTP: number = 0;
    novaAvgByTP: number = 0;
    totalMin: number = 0;
    totalMax: number = 0;
    totalAvg: number = 0;
    totalMinByTP: number = 0;
    totalMaxByTP: number = 0;
    totalAvgByTP: number = 0;

    constructor() { }

    static getItemDamage(item: Chip | Weapon, source: Entity, target: Entity, checkCrits: boolean) {
        const damage: Damage = new Damage();
        item.features.forEach((feature: Feature) => {
            if (feature.type === Effect.DAMAGE) {
                damage.strengthMin += feature.minValue;
                damage.strengthMax += feature.maxValue;
            } else if (feature.type == Effect.POISON) {
                var formula = (source.magic / 100 + 1) * (source.power / 100 + 1);
                damage.poisonMin = Math.round(feature.minValue * formula);
                damage.poisonMax = Math.round(feature.maxValue * formula);
                damage.poisonAvg = (damage.poisonMin + damage.poisonMax) / 2;
                damage.poisonMinByTP = feature.minValue / item.cost;
                damage.poisonMaxByTP = feature.maxValue / item.cost;
                damage.poisonAvgByTP = (feature.minValue + feature.maxValue) / 2 / item.cost;
            } else if (feature.type == Effect.NOVA_DAMAGE) {
                const formula = (value: number) => Math.min(target.maxLife - target.life, value * (source.science / 100 + 1) * (source.power / 100 + 1));
                damage.novaMin = Math.round(formula(feature.minValue));
                damage.novaMax = Math.round(formula(feature.maxValue));
                damage.novaAvg = (damage.novaMin + damage.novaMax) / 2;
                damage.novaMinByTP = feature.minValue / item.cost;
                damage.novaMaxByTP = feature.maxValue / item.cost;
                damage.novaAvgByTP = (feature.minValue + feature.maxValue) / 2 / item.cost;
            }
        })

        const multiplier = (source.strength / 100 + 1) * (source.power / 100 + 1)
        const relative = (1 - target.relativeShield / 100);
        const absolute = target.absoluteShield;
        const calculateDmg = (base: number) => Math.round(base * multiplier * relative - absolute);

        damage.strengthMinByTP = damage.strengthMin / item.cost;
        damage.strengthMaxByTP = damage.strengthMax / item.cost;
        damage.strengthAvgByTP = (damage.strengthMin + damage.strengthMax) / 2 / item.cost;
        damage.strengthMin = calculateDmg(damage.strengthMin);
        damage.strengthMax = calculateDmg(damage.strengthMax);
        damage.strengthAvg = (damage.strengthMin + damage.strengthMax) / 2;

        damage.totalMin = damage.strengthMin + damage.poisonMin;
        damage.totalMax = damage.strengthMax + damage.poisonMax;
        damage.totalAvg = damage.strengthAvg + damage.poisonAvg;
        damage.totalMinByTP = damage.strengthMinByTP + damage.poisonMinByTP;
        damage.totalMaxByTP = damage.strengthMaxByTP + damage.poisonMaxByTP;
        damage.totalAvgByTP = damage.strengthAvgByTP + damage.poisonAvgByTP;

        return damage;
    }

    static addDamages(damages: Damage[]): Damage {
        const damage: Damage = new Damage();
        damage.strengthMin = damages.reduce((sum, d) => sum + d.strengthMin, 0);
        damage.strengthMax = damages.reduce((sum, d) => sum + d.strengthMax, 0);
        damage.strengthAvg = (damage.strengthMin + damage.strengthMax) / 2;
        damage.strengthMinByTP = damages.reduce((sum, d) => sum + d.strengthMinByTP, 0);
        damage.strengthMaxByTP = damages.reduce((sum, d) => sum + d.strengthMaxByTP, 0);
        damage.strengthAvgByTP = (damage.strengthMinByTP + damage.strengthMaxByTP) / 2;
        damage.poisonMin = damages.reduce((sum, d) => sum + d.poisonMin, 0);
        damage.poisonMax = damages.reduce((sum, d) => sum + d.poisonMax, 0);
        damage.poisonAvg = (damage.poisonMin + damage.poisonMax) / 2;
        damage.poisonMinByTP = damages.reduce((sum, d) => sum + d.poisonMinByTP, 0);
        damage.poisonMaxByTP = damages.reduce((sum, d) => sum + d.poisonMaxByTP, 0);
        damage.poisonAvgByTP = (damage.poisonMinByTP + damage.poisonMaxByTP) / 2;
        damage.novaMin = damages.reduce((sum, d) => sum + d.novaMin, 0);
        damage.novaMax = damages.reduce((sum, d) => sum + d.novaMax, 0);
        damage.novaAvg = (damage.novaMin + damage.novaMax) / 2;
        damage.novaMinByTP = damages.reduce((sum, d) => sum + d.novaMinByTP, 0);
        damage.novaMaxByTP = damages.reduce((sum, d) => sum + d.novaMaxByTP, 0);
        damage.novaAvgByTP = (damage.novaMinByTP + damage.novaMaxByTP) / 2;
        damage.totalMin = damages.reduce((sum, d) => sum + d.totalMin, 0);
        damage.totalMax = damages.reduce((sum, d) => sum + d.totalMax, 0);
        damage.totalAvg = (damage.totalMin + damage.totalMax) / 2;
        damage.totalMinByTP = damages.reduce((sum, d) => sum + d.totalMinByTP, 0);
        damage.totalMaxByTP = damages.reduce((sum, d) => sum + d.totalMaxByTP, 0);
        damage.totalAvgByTP = (damage.totalMinByTP + damage.totalMaxByTP) / 2;
        return damage;
    }
}