export class Damage {
    strength: number[]; 
    poison: number[];
    nova: number[];
    total: number[]; 

    constructor(strength: number[] = [], poison: number[] = [], nova: number[] = [], total: number[] = []) {
        this.strength = strength;
        this.poison = poison;
        this.nova = nova;
        this.total = total;
    }
}