



function listerNombresPremiers(limite: number): number[] {
    if (limite < 2) return [];

    const estPremier: boolean[] = new Array(limite + 1).fill(true);
    estPremier[0] = false;
    estPremier[1] = false;

    const racine: number = Math.floor(Math.sqrt(limite));

    for (let i = 2; i <= racine; i++) {
        if (estPremier[i]) {
            for (let j = i * i; j <= limite; j += i) {
                estPremier[j] = false;
            }
        }
    }

    const premiers: number[] = [];
    for (let i = 2; i <= limite; i++) {
        if (estPremier[i]) {
            premiers.push(i);
        }
    }

    return premiers;
}

const premiers = listerNombresPremiers(306);

const glagolitic: { [key: string]: number } = {
    "Ⰰ": 1,
    "Ⰱ": 2,
    "Ⰲ": 3,
    "Ⰳ": 4,
    "Ⰴ": 5,
    "Ⰵ": 6,
    "Ⰶ": 7,
    "Ⰷ": 8,
    "Ⰸ": 9,
    "Ⰹ": 10,
    "Ⰻ": 20,
    "Ⰼ": 30,
    "Ⰽ": 40,
    "Ⰾ": 50,
    "Ⰿ": 60,
    "Ⱀ": 70,
    "Ⱁ": 80,
    "Ⱂ": 90,
    "Ⱃ": 100,
    "Ⱄ": 200,
    "Ⱅ": 300,
    "Ⱆ": 400,
    "Ⱇ": 500,
    "Ⱈ": 600,
    "Ⱉ": 700,
    "Ⱋ": 800,
    "Ⱌ": 900,
}

function decodeGlagolitic(input: string): number {
    return input.split('').reduce((acc, char) => acc + (glagolitic[char] || 0), 0);
}







let me: Me = Fight.me

me.setWeapon(Weapon.heavySword)

me = Fight.me
if (me.life * 100 / me.maxLife < 25) {
    me.useChip(Chip.regeneration)
}
me.useChip(Chip.stretching)
me.useChip(Chip.reflexes)
me.useChip(Chip.warmUp)
me.useChip(Chip.rage)
me.useChip(Chip.motivation)
me.useChip(Chip.knowledge)
me.useChip(Chip.adrenaline)
me.useChip(Chip.armoring)
me.useChip(Chip.elevation)
me.useChip(Chip.sevenLeagueBoots)
me.useChip(Chip.serum)
me.useChip(Chip.protein)
me.useChip(Chip.steroid)
me.useChip(Chip.vaccine)

const enemy = Fight.getNearestEnemy()
me.moveToward(enemy)
if (enemy.relativeShield > 15 || enemy.absoluteShield > 150) {
    me.useChip(Chip.liberation, enemy)
}
if (me.tp >= 19) {
    me.useChip(Chip.inversion, enemy)
}
me.useWeapon(enemy)
me.useChip(Chip.covetousness, enemy)





if (Fight.type === Fight.Type.BOSS) {
    const listen: any[][] = Fight.listen().filter(([id, message]) => Entity.get(id).side === 1 && !message.includes("!"));
    let codes: number[] = [];
    if (listen.length / 3 > 1) {
        console.log(listen);
        codes = listen.map(([id, message]) => decodeGlagolitic(message));
        console.log(codes);
    }
    const facteurs: number[] = []
    const sorted = codes.sort((a, b) => a - b)
    const stringified = sorted.join("")
    const code = parseInt(stringified)
    premiers.forEach(premier => {
        const result = code % premier
        if (result === 0) {
            facteurs.push(premier)
        }
    })
    console.log(facteurs)
}