import { AoeType, ChipType, Stat } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { Chip } from "../class/chip";

export const SHOCK: Chip = new Chip(
	LS.CHIP_SHOCK,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_SHOCK),
	[7],
	[9],
	LS.getChipCooldown(LS.CHIP_SHOCK),
	[Stat.STRENGTH],
	[],
	0,
	0,
	6,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const BANDAGE: Chip = new Chip(
	LS.CHIP_BANDAGE,
	[ChipType.HEAL],
	LS.getChipCost(LS.CHIP_BANDAGE),
	[13],
	[18],
	LS.getChipCooldown(LS.CHIP_BANDAGE),
	[Stat.WISDOM],
	[],
	0,
	0,
	6,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const PEBBLE: Chip = new Chip(
	LS.CHIP_PEBBLE,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_PEBBLE),
	[2],
	[34],
	LS.getChipCooldown(LS.CHIP_PEBBLE),
	[Stat.STRENGTH],
	[],
	0,
	0,
	5,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const PROTEIN: Chip = new Chip(
	LS.CHIP_PROTEIN,
	[ChipType.BUFF],
	LS.getChipCost(LS.CHIP_PROTEIN),
	[80],
	[100],
	LS.getChipCooldown(LS.CHIP_PROTEIN),
	[],
	[Stat.STRENGTH],
	2,
	0,
	4,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const ICE: Chip = new Chip(
	LS.CHIP_ICE,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_ICE),
	[17],
	[19],
	LS.getChipCooldown(LS.CHIP_ICE),
	[Stat.STRENGTH],
	[],
	0,
	0,
	8,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const HELMET: Chip = new Chip(
	LS.CHIP_HELMET,
	[ChipType.ABSOLUTE],
	LS.getChipCost(LS.CHIP_HELMET),
	[15],
	[15],
	LS.getChipCooldown(LS.CHIP_HELMET),
	[Stat.RESISTANCE],
	[],
	2,
	0,
	4,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const ROCK: Chip = new Chip(
	LS.CHIP_ROCK,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_ROCK),
	[38],
	[39],
	LS.getChipCooldown(LS.CHIP_ROCK),
	[Stat.RESISTANCE],
	[],
	2,
	0,
	4,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const MOTIVATION: Chip = new Chip(
	LS.CHIP_MOTIVATION,
	[ChipType.BUFF],
	LS.getChipCost(LS.CHIP_MOTIVATION),
	[3],
	[3],
	LS.getChipCooldown(LS.CHIP_MOTIVATION),
	[],
	[Stat.TP],
	2,
	0,
	5,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const STRETCHING: Chip = new Chip(
	LS.CHIP_STRETCHING,
	[ChipType.BUFF],
	LS.getChipCost(LS.CHIP_STRETCHING),
	[80],
	[100],
	LS.getChipCooldown(LS.CHIP_STRETCHING),
	[],
	[Stat.AGILITY],
	2,
	0,
	5,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const WALL: Chip = new Chip(
	LS.CHIP_WALL,
	[ChipType.RELATIVE],
	LS.getChipCost(LS.CHIP_WALL),
	[5],
	[6],
	LS.getChipCooldown(LS.CHIP_WALL),
	[Stat.RESISTANCE],
	[],
	2,
	0,
	3,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const SPARK: Chip = new Chip(
	LS.CHIP_SPARK,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_SPARK),
	[8],
	[16],
	LS.getChipCooldown(LS.CHIP_SPARK),
	[Stat.STRENGTH],
	[],
	0,
	0,
	10,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	false
)
export const CURE: Chip = new Chip(
	LS.CHIP_CURE,
	[ChipType.HEAL],
	LS.getChipCost(LS.CHIP_CURE),
	[35],
	[43],
	LS.getChipCooldown(LS.CHIP_CURE),
	[Stat.WISDOM],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_CURE),
	LS.getChipMaxRange(LS.CHIP_CURE),
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const LEATHER_BOOTS: Chip = new Chip(
	LS.CHIP_LEATHER_BOOTS,
	[ChipType.BUFF],
	LS.getChipCost(LS.CHIP_LEATHER_BOOTS),
	[2],
	[2],
	LS.getChipCooldown(LS.CHIP_LEATHER_BOOTS),
	[],
	[Stat.MP],
	2,
	LS.getChipMinRange(LS.CHIP_LEATHER_BOOTS),
	LS.getChipMaxRange(LS.CHIP_LEATHER_BOOTS),
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const FLASH: Chip = new Chip(
	LS.CHIP_FLASH,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_FLASH),
	[32],
	[35],
	LS.getChipCooldown(LS.CHIP_FLASH),
	[Stat.STRENGTH],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_FLASH),
	LS.getChipMaxRange(LS.CHIP_FLASH),
	AoeType.PLUS,
	AoeType.CIRCLE,
	1,
	true
)
export const FLAME: Chip = new Chip(
	LS.CHIP_FLAME,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_FLAME),
	[29],
	[31],
	LS.getChipCooldown(LS.CHIP_FLAME),
	[Stat.STRENGTH],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_FLAME),
	LS.getChipMaxRange(LS.CHIP_FLAME),
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const KNOWLEDGE: Chip = new Chip(
	LS.CHIP_KNOWLEDGE,
	[ChipType.BUFF],
	LS.getChipCost(LS.CHIP_KNOWLEDGE),
	[150],
	[170],
	LS.getChipCooldown(LS.CHIP_KNOWLEDGE),
	[],
	[Stat.WISDOM],
	2,
	LS.getChipMinRange(LS.CHIP_KNOWLEDGE),
	LS.getChipMaxRange(LS.CHIP_KNOWLEDGE),
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const ROCKFALL: Chip = new Chip(
	LS.CHIP_ROCKFALL,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_ROCKFALL),
	[50],
	[58],
	LS.getChipCooldown(LS.CHIP_ROCKFALL),
	[Stat.STRENGTH],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_ROCKFALL),
	LS.getChipMaxRange(LS.CHIP_ROCKFALL),
	AoeType.CIRCLE,
	AoeType.CIRCLE,
	2,
	true
)
export const STALACTITE: Chip = new Chip(
	LS.CHIP_STALACTITE,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_STALACTITE),
	[64],
	[67],
	LS.getChipCooldown(LS.CHIP_STALACTITE),
	[Stat.STRENGTH],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_STALACTITE),
	LS.getChipMaxRange(LS.CHIP_STALACTITE),
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const ICEBERG: Chip = new Chip(
	LS.CHIP_ICEBERG,
	[ChipType.DAMAGE],
	LS.getChipCost(LS.CHIP_ICEBERG),
	[82],
	[90],
	LS.getChipCooldown(LS.CHIP_ICEBERG),
	[Stat.STRENGTH],
	[],
	0,
	LS.getChipMinRange(LS.CHIP_ICEBERG),
	LS.getChipMaxRange(LS.CHIP_ICEBERG),
	AoeType.PLUS,
	AoeType.CIRCLE,
	2,
	true
)
export const TOXIN: Chip = new Chip(
	LS.CHIP_TOXIN,
	[ChipType.POISON],
	LS.getChipCost(LS.CHIP_TOXIN),
	[25],
	[35],
	LS.getChipCooldown(LS.CHIP_TOXIN),
	[Stat.MAGIC],
	[],
	3,
	LS.getChipMinRange(LS.CHIP_TOXIN),
	LS.getChipMaxRange(LS.CHIP_TOXIN),
	AoeType.CIRCLE,
	AoeType.CIRCLE,
	2,
	true
)
export const TRANQUILIZER: Chip = new Chip(
	LS.CHIP_TRANQUILIZER,
	[ChipType.DEBUFF],
	3,
	[0.3],
	[0.4],
	0,
	[Stat.MAGIC],
	[Stat.TP],
	1,
	1,
	8,
	AoeType.CIRCLE,
	AoeType.CIRCLE,
	1,
	true
)
export const VENOM: Chip = new Chip(
	LS.CHIP_VENOM,
	[ChipType.POISON],
	4,
	[15],
	[20],
	1,
	[Stat.MAGIC],
	[],
	3,
	1,
	8,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)
export const LIBERATION: Chip = new Chip(
	LS.CHIP_LIBERATION,
	[ChipType.DEBUFF],
	5,
	[60],
	[60],
	5,
	[],
	[],
	0,
	0,
	6,
	AoeType.CIRCLE,
	AoeType.POINT,
	0,
	true
)

export const chips: Chip[] = [SHOCK, BANDAGE, PEBBLE, PROTEIN, ICE, HELMET, ROCK, MOTIVATION, STRETCHING, WALL, SPARK, CURE, LEATHER_BOOTS, FLASH, FLAME, KNOWLEDGE, ROCKFALL, STALACTITE, ICEBERG, TOXIN, TRANQUILIZER, VENOM, LIBERATION];