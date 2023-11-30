import { LS } from "../../globaux/ls";
import { Chip } from "./item/chip";
import { Weapon } from "./item/weapon";
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
        this.weapons = LS.arrayMap(LS.getWeapons(this.id), weaponId => Weapon.getById(weaponId));
        this.chips = Chip.getChipsOf(entityId);
        this.weapon = this.weapons[0];
    }

    life() {
        return LS.getLife(this.id);
    }
    totalLife() {
        return LS.getTotalLife(this.id);
    }
    lifePercent() {
        return this.life() * 100 / this.totalLife();
    }
    strength() {
        return LS.getStrength(this.id);
    }
    power() {
        return LS.getPower(this.id);
    }
    wisdom() {
        return LS.getWisdom(this.id);
    }
    agility() {
        return LS.getAgility(this.id);
    }
    resistance() {
        return LS.getResistance(this.id);
    }
    absolute() {
        return LS.getAbsoluteShield(this.id);
    }
    relative() {
        return LS.getRelativeShield(this.id);
    }
    science() {
        return LS.getScience(this.id);
    }
    magic() {
        return LS.getMagic(this.id);
    }
    mp() {
        return LS.getMP(this.id);
    }
    tp() {
        return LS.getTP(this.id);
    }

    isDead() {
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
        LS.debug("move and attack : " + cell);
        if (cell) {
            LS.moveTowardCell(cell.number);
            LS.useWeaponOnCell(cell.number);
        }
    }
}