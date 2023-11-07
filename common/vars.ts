import {LS} from "../globaux/ls";
import {Cell} from "./class/cell";
import {Leek} from "./class/leek";

export const mode: number = LS.getFightType();
export const field: Array<Cell> = Cell.initField();
export let turn: number = 0;
turn++;

export const myLeek: Leek = new Leek(LS.getEntity());
export let enemy: Leek;

if (!enemy || LS.isDead(enemy.id) || Effect.isDeadByPoison(enemy.id)) {
    searchEnemy();
}

export function searchEnemy() {
    if (LS.count(LS.getAliveEnemies()) === 0) {
        return;
    }
    enemy = new Leek(LS.getNearestEnemy());
    while (LS.getType(enemy.id) !== LS.ENTITY_LEEK) {
        enemy = new Leek(LS.getNearestEnemyTo(enemy.id));
    }
}