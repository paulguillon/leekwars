import { getLevel, getName, getType } from "../../../ressources/ls";
import { Chip } from "../item/chip";

export class Entity {
    id: number;
    name: string;
    level: number;
    chips: Chip[];
    type: number;
    
    constructor(entityId: number) {
        this.id = entityId;
        this.name = getName(entityId);
        this.level = getLevel(entityId);
        this.chips = Chip.getChipsOf(entityId);
        this.type = getType(entityId);
    }
}