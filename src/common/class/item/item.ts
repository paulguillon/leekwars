import { AoeType } from "../../../globaux/enums";
import { LS } from "../../../globaux/ls";
import { areaToAoeSize, areaToAoeType, launchTypeToAoeType } from "../../mapping";
import { Damage } from "../damage";
import { ItemEffect } from "./itemEffect";

export class Item {
    id: number;
    name: string;
    level: number;
    minRange: number;
    maxRange: number;
    launchType: AoeType;
    itemEffects: ItemEffect[];
    cost: number;
    aoeType: AoeType;
    aoeSize: number;
    los: boolean;
    template: number;
    damage: Damage;

    constructor(id: number, name: string, level: number, minRange: number, maxRange: number, launchType: number, itemEffects: ItemEffect[], cost: number, area: number, los: boolean, template: number) {
        this.id = id;
        this.name = LS.toUpper(LS.replace(name, '_', ' '));
        this.level = level;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.launchType = launchTypeToAoeType(launchType);
        this.itemEffects = itemEffects;
        this.cost = cost;
        this.aoeType = areaToAoeType(area);
        this.aoeSize = areaToAoeSize(area);
        this.los = los;
        this.template = template;
        this.damage = new Damage();
    }
}