/**
 * center
 * area
 * min
 * max
 * walkableOnly
 */
function getCellsByArea(center: Cell, area: Item.LaunchType | Item.Area, min: number = 0, max: number = 1, walkableOnly: boolean = false) {
    if (min > max) return [];
    let cells: Cell[] = [];
    switch (area) {
        case Item.LaunchType.CIRCLE:
            for (let x = -max; x <= max; x++) {
                for (let y = -max + Math.abs(x); y <= max - Math.abs(x); y++) {
                    if (Math.abs(x) + Math.abs(y) < min) continue;
                    const cell: Cell = Field.cellFromXY(center.x + x, center.y + y);
                    if (!cell || cell.obstacle) continue;
                    cells.push(cell);
                }
            }
            break;
        case Item.LaunchType.DIAGONAL:
            for (let xy = min / 2; xy <= max / 2; xy++) {
                if (Field.cellFromXY(center.x + xy, center.y + xy)) cells.push(Field.cellFromXY(center.x + xy, center.y + xy));
                if (Field.cellFromXY(center.x - xy, center.y - xy)) cells.push(Field.cellFromXY(center.x - xy, center.y - xy));
                if (Field.cellFromXY(center.x + xy, center.y - xy)) cells.push(Field.cellFromXY(center.x + xy, center.y - xy));
                if (Field.cellFromXY(center.x - xy, center.y + xy)) cells.push(Field.cellFromXY(center.x - xy, center.y + xy));
                cells = cells.filter(c => !c?.obstacle);
            }
            break;
        case Item.LaunchType.LINE:
            for (let xy = -max; xy <= max; xy++) {
                const cell1: Cell = Field.cellFromXY(center.x + xy, center.y);
                if (cell1 && Field.distance(center, cell1) >= min && !cell1.obstacle) {
                    cells.push(cell1);
                }
                const cell2: Cell = Field.cellFromXY(center.x, center.y + xy);
                if (cell2 && Field.distance(center, cell2) >= min && !cell2.obstacle) {
                    cells.push(cell2);
                }
            }
            break;
        case Item.Area.SQUARE_1:
        case Item.Area.SQUARE_2:
            for (let x = -max; x <= max; x++) {
                for (let y = -max; y <= max; y++) {
                    const cell: Cell = Field.cellFromXY(center.x + x, center.y + y);
                    if (!cell || Math.abs(x) < min && Math.abs(y) < min || cell.obstacle) continue;
                    cells.push(cell);
                }
            }
            break;
    }
    if (!walkableOnly) return cells;
    const entity: Entity = center.entity;
    return cells.filter((cell) => center.pathLength(cell) <= entity.mp);
}


function beforeFight(): void {
    Fight.me.setLoadout("Fenouil", false)
}

function turn(): void {
    const me: Me = Fight.me
    const graal: Entity = Fight.getEnemies().find(e => e.name === "Graal")

    const jaune: Entity = Fight.getEnemies().find(e => e.name === "Cristal jaune")
    const rouge: Entity = Fight.getEnemies().find(e => e.name === "Cristal rouge")
    const bleu: Entity = Fight.getEnemies().find(e => e.name === "Cristal bleu")
    const vert: Entity = Fight.getEnemies().find(e => e.name === "Cristal vert")
    //jaune 84 vert 85
    //rouge 119 bleu 120
    Debug.mark([84, 86], Color.rgb(255, 255, 0))
    Debug.mark([85, 394], Color.GREEN)
    Debug.mark([119, 362], Color.RED)
    Debug.mark([120, 33], Color.BLUE)
    Debug.mark(102, Color.rgb(255, 119, 0))

    const cells: Cell[] = getCellsByArea(bleu.cell, Item.LaunchType.LINE, 1, 8)
    Debug.log(cells)
    Debug.mark(cells,Color.BLUE)



    if (Fight.turn == 1) {
        me.useChipOnCell(Chip.jump, 280)
        me.moveTowardCells([229])
    }
    if (Fight.turn > 32) {
        if (Fight.turn == 33) {
            me.useChipOnCell(Chip.teleportation, 200)
        }





    } else {
        if (!Chip.armoring.currentCooldown) {
            me.useChip(Chip.stretching)
            me.useChip(Chip.reflexes)
            me.useChip(Chip.rage)
            if (Fight.turn < 32) {
                me.useChipOnCell(Chip.jump, 280)
            }
            me.moveTowardCells([229])
            me.useChip(Chip.knowledge)
            me.useChip(Chip.armoring)
        }
        me.useChip(Chip.fortress)
        me.useChip(Chip.wall)
        me.useChipOnCell(Chip.transmutation, me.cell.id - 18)
        me.useChip(Chip.mutation)
        me.useChip(Chip.remission)
        me.useChip(Chip.serum)
    }
}