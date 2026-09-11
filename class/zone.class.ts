export function getCellsByArea(center: Cell, area: Item.LaunchType | Item.Area, min: number = 0, max: number = 1, walkableOnly: boolean = false) {
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
        case Item.LaunchType.DIAGONAL_INVERTED:
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
        case Item.LaunchType.LINE_INVERTED:
            break;
        case Item.LaunchType.STAR:
            cells = getCellsByArea(center, Item.LaunchType.LINE, min, max, walkableOnly)
                .concat(getCellsByArea(center, Item.LaunchType.DIAGONAL, min, max, walkableOnly))
            break;
        case Item.LaunchType.STAR_INVERTED:
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