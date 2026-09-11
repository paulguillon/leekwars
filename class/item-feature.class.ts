export class ItemFeature {
    min: number;
    max: number;
    turns: number;
    onAllies: number;
    onEnemies: number;
    onCaster: number;
    onSummons: number;
    onNotSummons: number;
    stackable: number;
    multipliedByTargets: number;
    hitCaster: number;
    notReplaceable: number;
    irreductible: number;
    type: Effect.Type;

    constructor(feature: Feature) {
        this.type = feature.type;
        this.min = feature.minValue;
        this.max = feature.maxValue;
        this.turns = feature.turns;

        const targets: number = feature.targets;
        this.onEnemies = targets & Effect.Target.ENEMIES;
        this.onAllies = targets & Effect.Target.ALLIES;
        this.onCaster = targets & Effect.Target.CASTER;
        this.onNotSummons = targets & Effect.Target.NON_SUMMONS;
        this.onSummons = targets & Effect.Target.SUMMONS;

        const modifiers: number = feature.modifiers;

        this.stackable = modifiers & Effect.Modifier.STACKABLE;
        this.multipliedByTargets = modifiers & Effect.Modifier.MULTIPLIED_BY_TARGETS;
        this.hitCaster = modifiers & Effect.Modifier.ON_CASTER;
        this.notReplaceable = modifiers & Effect.Modifier.NOT_REPLACEABLE;
        this.irreductible = modifiers & Effect.Modifier.IRREDUCTIBLE;
    }
}