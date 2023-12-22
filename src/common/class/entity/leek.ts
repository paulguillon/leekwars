import { LS } from "../../../globaux/ls";
import { Weapon } from "../item/weapon";
import { enemy, field } from "../../vars";
import { Cell } from "../cell";
import { Entity } from "./entity";

export class Leek extends Entity {
    weapons: Weapon[];
    weapon: Weapon;

    constructor(leekId: number) {
        super(leekId);
        this.weapons = LS.arrayMap(LS.getWeapons(this.id), weaponId => Weapon.getById(weaponId));
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
    frequency() {
        return LS.getFrequency(this.id);
    }
    cores() {
        return LS.getCores(this.id);
    }
    ram() {
        return LS.getRAM(this.id);
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
            LS.debug("Changement d'arme pour " + weapon.name);
            this.weapon = weapon;
            LS.setWeapon(weapon.id);
        }
    }

    attack(target: number = enemy.id) {
        if (!LS.isAlive(target)) return;
        
        if (LS.canUseWeapon(this.weapon.id, target)) {
            LS.useWeapon(target);
        }
    }

    moveAndAttack(target: number = enemy.id) {
        if (!LS.isAlive(target)) return;

        var cellsToUse = LS.arrayMap(LS.getCellsToUseWeapon(this.weapon.id, target), c => field[c]);
        var closest = Cell.getClosestCellPathTo(cellsToUse, this.id);
    
        const cell: Cell | null = (closest && LS.getPathLength(closest.number, LS.getCell()) < this.mp()) ? closest : null;
        LS.debug("move and attack : " + cell);
        if (cell) {
            LS.moveTowardCell(cell.number);
            LS.useWeaponOnCell(cell.number);
        }
    }
}