import {LS} from "../../globaux/ls";

export class Leek {
    id: number;
    name: string;
    level: number;
    life: number;
    totalLife: number;
    strength: number;
    wisdom: number;
    agility: number;
    resistance: number;
    magic: number;
    mp: number;
    tp: number;
    weapons: Array<Weapon>;
    chips: Array<Chip>;

    constructor(entityId: number) {
    this.id = entityId;
    this.name = LS.getName(entityId);
    this.level = LS.getLevel(entityId);
    this.life = LS.getLife(entityId);
    this.totalLife = LS.getTotalLife(entityId);
    this.strength = LS.getStrength(entityId);
    this.wisdom = LS.getWisdom(entityId);
    this.agility = LS.getAgility(entityId);
    this.resistance = LS.getResistance(entityId);
    this.magic = LS.getMagic(entityId);
    this.mp = LS.getMP(entityId);
    this.tp = LS.getTP(entityId);
    this.weapons = Weapon.getTargetWeapons(entityId);
    this.chips = Chip.getChipsOf(entityId);
}

//string() {
//return "" + this.id;
//}
}