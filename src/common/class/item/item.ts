import { AoeType } from "../../../globaux/enums";
import { Damage } from "../damage";
import { ItemEffect } from "./itemEffect";

export class Item {
    id: number;
    name: string;
    level: number;
    minRange: number;
    maxRange: number;
    launchType: AoeType;
    effects: ItemEffect[];
    cost: number;
    aoeType: AoeType;
    aoeSize: number;
    los: boolean;
    template: number;
    damage: Damage;

    constructor(id: number, name: string, level: number, minRange: number, maxRange: number, launchType: AoeType, effects: ItemEffect[], cost: number, aoeType: AoeType, aoeSize: number, los: boolean, template: number) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.launchType = launchType;
        this.effects = effects;
        this.cost = cost;
        this.aoeType = aoeType;
        this.aoeSize = aoeSize;
        this.los = los;
        this.template = template;
        this.damage = new Damage();
    }
}