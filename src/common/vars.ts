import { LS } from "../globaux/ls";
import { Cell } from "./class/cell";
import { Effect } from "./class/effect";
import { Leek } from "./class/entity/leek";

export const mode: number = LS.getFightType();
export const field: Cell[] = Cell.initField();
export let turn: number = 0;
turn++;

export const myLeek: Leek = new Leek(LS.getEntity());
export let enemy: Leek = new Leek(LS.getNearestEnemy());

if (LS.isDead(enemy.id) || Effect.isDeadByPoison(enemy.id)) {
    searchEnemy();
}

export function searchEnemy() {
    if (LS.count(LS.getAliveEnemies()) === 0) {
        return;
    }
    enemy = new Leek(LS.getNearestEnemy());
}