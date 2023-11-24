import { AoeType, ChipType, Stat } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { Chip } from "../class/chip/chip";

export const SHOCK: Chip = new Chip(
	LS.CHIP_SHOCK, // id
	2, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const BANDAGE: Chip = new Chip(
	LS.CHIP_BANDAGE, // id
	3, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	2 // type
)
export const PEBBLE: Chip = new Chip(
	LS.CHIP_PEBBLE, // id
	4, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const PROTEIN: Chip = new Chip(
	LS.CHIP_PROTEIN, // id
	6, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	38 // type
)
export const ICE: Chip = new Chip(
	LS.CHIP_ICE, // id
	9, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const HELMET: Chip = new Chip(
	LS.CHIP_HELMET, // id
	10, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	6 // type
)
export const ROCK: Chip = new Chip(
	LS.CHIP_ROCK, // id
	13, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const MOTIVATION: Chip = new Chip(
	LS.CHIP_MOTIVATION, // id
	14, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	32 // type
)
export const STRETCHING: Chip = new Chip(
	LS.CHIP_STRETCHING, // id
	17, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	41 // type
)
export const WALL: Chip = new Chip(
	LS.CHIP_WALL, // id
	18, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	5 // type
)
export const SPARK: Chip = new Chip(
	LS.CHIP_SPARK, // id
	19, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const CURE: Chip = new Chip(
	LS.CHIP_CURE, // id
	20, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	2 // type
)
export const LEATHER_BOOTS: Chip = new Chip(
	LS.CHIP_LEATHER_BOOTS, // id
	22, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	31 // type
)
export const FLASH: Chip = new Chip(
	LS.CHIP_FLASH, // id
	24, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const FLAME: Chip = new Chip(
	LS.CHIP_FLAME, // id
	29, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const KNOWLEDGE: Chip = new Chip(
	LS.CHIP_KNOWLEDGE, // id
	32, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	22 // type
)
export const ROCKFALL: Chip = new Chip(
	LS.CHIP_ROCKFALL, // id
	77, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const STALACTITE: Chip = new Chip(
	LS.CHIP_STALACTITE, // id
	50, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const ICEBERG: Chip = new Chip(
	LS.CHIP_ICEBERG, // id
	100, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	1 // type
)
export const TOXIN: Chip = new Chip(
	LS.CHIP_TOXIN, // id
	125, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	6 // type
)
export const TRANQUILIZER: Chip = new Chip(
	LS.CHIP_TRANQUILIZER, // id
	65, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	18 // type
)
export const VENOM: Chip = new Chip(
	LS.CHIP_VENOM, // id
	42, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	6 // type
)
export const LIBERATION: Chip = new Chip(
	LS.CHIP_LIBERATION, // id
	60, // level
	false, // team cooldown
	0, // initial cooldown
	0, // template
	9 // type
)

export const chips: Chip[] = [SHOCK, BANDAGE, PEBBLE, PROTEIN, ICE, HELMET, ROCK, MOTIVATION, STRETCHING, WALL, SPARK, CURE, LEATHER_BOOTS, FLASH, FLAME, KNOWLEDGE, ROCKFALL, STALACTITE, ICEBERG, TOXIN, TRANQUILIZER, VENOM, LIBERATION];