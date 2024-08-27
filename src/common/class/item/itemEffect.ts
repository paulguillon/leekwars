import { inArray } from "transpiler-ls";

export class ItemEffect {
    min: number;
    max: number;
    turns: number;
    onAllies: boolean;
    onEnemies: boolean;
    onCaster: boolean;
    onSummons: boolean;
    onNotSummons: boolean;
    stackable: boolean;
    multipliedByTargets: boolean;
    hitCaster: boolean;
    notReplaceable: boolean;
    irreductible: boolean;
    type: number;

    constructor(effect: number[]) {
        this.type = effect[0];
        this.min = effect[1];
        this.max = effect[2];
        this.turns = effect[3];

        const targets: number = effect[4];
        //1
        this.onEnemies = targets % 2 == 1;
        //2
        this.onAllies = inArray([2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31], targets);
        //4 don't forget to check min range == 0
        this.onCaster = inArray([4, 5 ,6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31], targets);
        //8
        this.onNotSummons = inArray([8, 9, 10, 11, 12, 13, 14 , 15, 24, 25, 26, 27, 28 , 29, 30, 31], targets);
        //16
        this.onSummons = targets >= 16;

        const modifiers: number = effect[5];
        //1
        this.stackable = modifiers % 2 == 1;
        //2
        this.multipliedByTargets = inArray([2, 3, 6, 7, 10, 11, 14, 15, 18, 19, 22, 23, 26, 27, 30, 31], modifiers);
        //4
        this.hitCaster = inArray([4, 5 ,6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31], modifiers);
        //8
        this.notReplaceable = inArray([8, 9, 10, 11, 12, 13, 14 , 15, 24, 25, 26, 27, 28 , 29, 30, 31], modifiers);
        //16
        this.irreductible = modifiers >= 16;
    }
}