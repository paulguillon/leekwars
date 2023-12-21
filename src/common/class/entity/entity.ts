import { LS } from "../../../globaux/ls";
import { Chip } from "../item/chip";

export class Entity {
    id: number;
    name: string;
    level: number;
    chips: Chip[];
    type: number;
    
    constructor(entityId: number) {
        this.id = entityId;
        this.name = LS.getName(entityId);
        this.level = LS.getLevel(entityId);
        this.chips = Chip.getChipsOf(entityId);
        this.type = LS.getType(entityId);
    }
}