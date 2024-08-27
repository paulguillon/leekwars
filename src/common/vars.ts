import { count, getAliveEnemies, getEntity, getFightType, getNearestEnemy, isDead } from "transpiler-ls";
import { Cell } from "./class/cell";
import { Effect } from "./class/effect";
import { Leek } from "./class/entity/leek";

export const mode: number = getFightType();
export const field: Cell[] = Cell.initField();
export let turn: number = 0;
turn++;

export const myLeek: Leek = new Leek(getEntity());
export let enemy: Leek = new Leek(getNearestEnemy());

if (isDead(enemy.id) || Effect.isDeadByPoison(enemy.id)) {
    searchEnemy();
}

export function searchEnemy() {
    if (count(getAliveEnemies()) === 0) {
        return;
    }
    enemy = new Leek(getNearestEnemy());
}