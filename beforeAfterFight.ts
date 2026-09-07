//Exemple

//turn est obligatoire pour beforeFight
function beforeFight(): void {
    console.log(Fight.getNearestEnemy().weapons)
    if (Fight.getNearestEnemy().chips.includes(Chip.fortress)) {
        Fight.me.setLoadout("anti-poison", false)
    }
}

function turn(): void {
    Fight.me.weapons.forEach(w => console.log(w.name))
}

function afterFight(): void {
    switch (Fight.winner) {
        case -1:
            console.log("En cours")
            break;
        case 0:
            console.log("Victoire")
            break;
        case 1:
            console.log("Défaite")
            break;
        case 2:
            console.log("Égalité")
            break;
    }
}