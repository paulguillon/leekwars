import { AoeType } from "../globaux/enums";
import { LS } from "../globaux/ls";

export function launchTypeToAoeType(launchType: number): AoeType {
    if (launchType == LS.LAUNCH_TYPE_LINE) return AoeType.LASER;
    if (launchType == LS.LAUNCH_TYPE_LINE_INVERTED) return AoeType.LASER;
    if (launchType == LS.LAUNCH_TYPE_DIAGONAL) return AoeType.CROSS;
    if (launchType == LS.LAUNCH_TYPE_DIAGONAL_INVERTED) return AoeType.CROSSINVERTED;
    if (launchType == LS.LAUNCH_TYPE_STAR) return AoeType.STAR;
    if (launchType == LS.LAUNCH_TYPE_STAR_INVERTED) return AoeType.STARINVERTED;
    return AoeType.CIRCLE;
}

export function areaToAoeType(area: number): AoeType {
    if (LS.inArray([LS.AREA_CIRCLE_1, LS.AREA_CIRCLE_2, LS.AREA_CIRCLE_3], area)) return AoeType.CIRCLE;
    if (LS.inArray([LS.AREA_FIRST_INLINE, LS.AREA_LASER_LINE], area)) return AoeType.LASER;
    if (LS.inArray([LS.AREA_PLUS_1, LS.AREA_PLUS_2, LS.AREA_PLUS_3], area)) return AoeType.PLUS;
    if (area == LS.AREA_POINT) return AoeType.POINT;
    if (LS.inArray([LS.AREA_SQUARE_1, LS.AREA_SQUARE_2], area)) return AoeType.SQUARE;
    if (LS.inArray([LS.AREA_X_1, LS.AREA_X_2, LS.AREA_X_3], area)) return AoeType.CROSS;
    return AoeType.POINT;
}

export function areaToAoeSize(area: number): number {
    if (LS.inArray([LS.AREA_CIRCLE_1, LS.AREA_PLUS_1, LS.AREA_SQUARE_1, LS.AREA_X_1], area)) return 1;
    if (LS.inArray([LS.AREA_CIRCLE_2, LS.AREA_PLUS_2, LS.AREA_SQUARE_2, LS.AREA_X_2], area)) return 2;
    if (LS.inArray([LS.AREA_CIRCLE_3, LS.AREA_PLUS_3, LS.AREA_X_3], area)) return 3;
    return 0;
}