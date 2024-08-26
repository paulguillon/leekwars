import { arrayMap, canUseWeapon, debug, getAbsoluteShield, getAgility, getCell, getCellsToUseWeapon, getFrequency, getLife, getMP, getMagic, getPathLength, getPower, getRelativeShield, getResistance, getScience, getStrength, getTP, getTotalLife, getWeapons, getWisdom, isAlive, isDead, moveTowardCell, setWeapon, useWeapon, useWeaponOnCell } from "../../../ressources/ls";
import { Weapon } from "../item/weapon";
import { enemy, field } from "../../vars";
import { Cell } from "../cell";
import { Entity } from "./entity";

export class Leek extends Entity {
    weapons: Weapon[];
    weapon: Weapon;

    constructor(leekId: number) {
        super(leekId);
        this.weapons = arrayMap(getWeapons(this.id), weaponId => Weapon.getById(weaponId));
        this.weapon = this.weapons[0];
    }

    life() {
        return getLife(this.id);
    }
    totalLife() {
        return getTotalLife(this.id);
    }
    lifePercent() {
        return this.life() * 100 / this.totalLife();
    }
    strength() {
        return getStrength(this.id);
    }
    power() {
        return getPower(this.id);
    }
    wisdom() {
        return getWisdom(this.id);
    }
    agility() {
        return getAgility(this.id);
    }
    resistance() {
        return getResistance(this.id);
    }
    absolute() {
        return getAbsoluteShield(this.id);
    }
    relative() {
        return getRelativeShield(this.id);
    }
    science() {
        return getScience(this.id);
    }
    magic() {
        return getMagic(this.id);
    }
    frequency() {
        return getFrequency(this.id);
    }
    mp() {
        return getMP(this.id);
    }
    tp() {
        return getTP(this.id);
    }

    isDead() {
        return isDead(this.id);
    }

    changeWeapon(weapon: Weapon) {
        if (this.weapon != weapon) {
            debug("Changement d'arme pour " + weapon.name);
            this.weapon = weapon;
            setWeapon(weapon.id);
        }
    }

    attack(target: number = enemy.id) {
        if (!isAlive(target)) return;
        
        if (canUseWeapon(this.weapon.id, target)) {
            useWeapon(target);
        }
    }

    moveAndAttack(target: number = enemy.id) {
        if (!isAlive(target)) return;

        var cellsToUse = arrayMap(getCellsToUseWeapon(this.weapon.id, target), c => field[c]);
        var closest = Cell.getClosestCellPathTo(cellsToUse, this.id);
    
        const cell: Cell | null = (closest && getPathLength(closest.number, getCell()) < this.mp()) ? closest : null;
        debug("move and attack : " + cell);
        if (cell) {
            moveTowardCell(cell.number);
            useWeaponOnCell(cell.number);
        }
    }
}