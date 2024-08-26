import { AoeType } from "../globaux/enums";
import { AREA_CIRCLE_1, AREA_CIRCLE_2, AREA_CIRCLE_3, AREA_FIRST_INLINE, AREA_LASER_LINE, AREA_PLUS_1, AREA_PLUS_2, AREA_PLUS_3, AREA_POINT, AREA_SQUARE_1, AREA_SQUARE_2, AREA_X_1, AREA_X_2, AREA_X_3, LAUNCH_TYPE_DIAGONAL, LAUNCH_TYPE_LINE, LAUNCH_TYPE_LINE_INVERTED, LAUNCH_TYPE_STAR, LAUNCH_TYPE_STAR_INVERTED, inArray } from "../ressources/ls";

export function launchTypeToAoeType(launchType: number): AoeType {
    if (launchType == LAUNCH_TYPE_LINE) return AoeType.LASER;
    if (launchType == LAUNCH_TYPE_LINE_INVERTED) return AoeType.LASER;
    if (launchType == LAUNCH_TYPE_DIAGONAL) return AoeType.CROSS;
    if (launchType == LAUNCH_TYPE_STAR) return AoeType.STAR;
    if (launchType == LAUNCH_TYPE_STAR_INVERTED) return AoeType.STARINVERTED;
    return AoeType.CIRCLE;
}

export function areaToAoeType(area: number): AoeType {
    if (inArray([AREA_CIRCLE_1, AREA_CIRCLE_2, AREA_CIRCLE_3], area)) return AoeType.CIRCLE;
    if (inArray([AREA_FIRST_INLINE, AREA_LASER_LINE], area)) return AoeType.LASER;
    if (inArray([AREA_PLUS_1, AREA_PLUS_2, AREA_PLUS_3], area)) return AoeType.PLUS;
    if (area == AREA_POINT) return AoeType.POINT;
    if (inArray([AREA_SQUARE_1, AREA_SQUARE_2], area)) return AoeType.SQUARE;
    if (inArray([AREA_X_1, AREA_X_2, AREA_X_3], area)) return AoeType.CROSS;
    return AoeType.POINT;
}

export function areaToAoeSize(area: number): number {
    if (inArray([AREA_CIRCLE_1, AREA_PLUS_1, AREA_SQUARE_1, AREA_X_1], area)) return 1;
    if (inArray([AREA_CIRCLE_2, AREA_PLUS_2, AREA_SQUARE_2, AREA_X_2], area)) return 2;
    if (inArray([AREA_CIRCLE_3, AREA_PLUS_3, AREA_X_3], area)) return 3;
    return 0;
}