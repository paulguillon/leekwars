import { LS } from "../../globaux/ls";
import { Chip } from "./chip/chip";
import { Weapon } from "./weapon";
import {enemy} from "../vars";
import {Cell} from "./cell";

export class Leek {
    id: number;
    name: string;
    level: number;
    weapons: Weapon[];
    chips: Chip[];
    weapon: Weapon;

    constructor(entityId: number) {
        this.id = entityId;
        this.name = LS.getName(entityId);
        this.level = LS.getLevel(entityId);
        this.weapons = Weapon.getTargetWeapons(entityId);
        this.chips = Chip.getChipsOf(entityId);
        this.weapon = this.weapons[0];
    }

    get life() {
        return LS.getLife(this.id);
    }
    get totalLife() {
        return LS.getTotalLife(this.id);
    }
    get lifePercent() {
        return this.life * 100 / this.totalLife;
    }
    get strength() {
        return LS.getStrength(this.id);
    }
    get power() {
        return LS.getPower(this.id);
    }
    get wisdom() {
        return LS.getWisdom(this.id);
    }
    get agility() {
        return LS.getAgility(this.id);
    }
    get resistance() {
        return LS.getResistance(this.id);
    }
    get magic() {
        return LS.getMagic(this.id);
    }
    get mp() {
        return LS.getMP(this.id);
    }
    get tp() {
        return LS.getTP(this.id);
    }

    get isDead() {
        return LS.isDead(this.id);
    }

    changeWeapon(weapon: Weapon) {
        if (this.weapon != weapon) {
            this.weapon = weapon;
            LS.setWeapon(weapon.id);
        }
    }

    attack(target: number = enemy.id) {
        if (LS.canUseWeapon(this.weapon.id, target)) {
            LS.useWeapon(target);
        }
    }

    moveAndAttack(target: number = enemy.id) {
        const cell: Cell | null = this.weapon.canMoveToUse(this.id, target);

        if (cell && LS.canUseWeapon(this.id, target)) {
            LS.useWeaponOnCell(cell.number);
        }
    }
}