import { AoeType, ChipType, Stat } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { Chip } from "../class/chip";

export const chips: { [c: number]: Chip } = {
	[LS.CHIP_SHOCK]: new Chip({
		id: LS.CHIP_SHOCK,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_SHOCK),
		minValues: [7],
		maxValues: [9],
		cooldown: LS.getChipCooldown(LS.CHIP_SHOCK),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 6,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_BANDAGE]: new Chip({
		id: LS.CHIP_BANDAGE,
		types: [ChipType.HEAL],
		cost: LS.getChipCost(LS.CHIP_BANDAGE),
		minValues: [13],
		maxValues: [18],
		cooldown: LS.getChipCooldown(LS.CHIP_BANDAGE),
		sourceStat: [Stat.WISDOM],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 6,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_PEBBLE]: new Chip({
		id: LS.CHIP_PEBBLE,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_PEBBLE),
		minValues: [2],
		maxValues: [34],
		cooldown: LS.getChipCooldown(LS.CHIP_PEBBLE),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 5,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_PROTEIN]: new Chip({
		id: LS.CHIP_PROTEIN,
		types: [ChipType.BUFF],
		cost: LS.getChipCost(LS.CHIP_PROTEIN),
		minValues: [80],
		maxValues: [100],
		cooldown: LS.getChipCooldown(LS.CHIP_PROTEIN),
		sourceStat: [],
		targetStat: [Stat.STRENGTH],
		duration: 2,
		minRange: 0,
		maxRange: 4,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_ICE]: new Chip({
		id: LS.CHIP_ICE,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_ICE),
		minValues: [17],
		maxValues: [19],
		cooldown: LS.getChipCooldown(LS.CHIP_ICE),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 8,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_HELMET]: new Chip({
		id: LS.CHIP_HELMET,
		types: [ChipType.ABSOLUTE],
		cost: LS.getChipCost(LS.CHIP_HELMET),
		minValues: [15],
		maxValues: [15],
		cooldown: LS.getChipCooldown(LS.CHIP_HELMET),
		sourceStat: [Stat.RESISTANCE],
		targetStat: [],
		duration: 2,
		minRange: 0,
		maxRange: 4,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_ROCK]: new Chip({
		id: LS.CHIP_ROCK,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_ROCK),
		minValues: [38],
		maxValues: [39],
		cooldown: LS.getChipCooldown(LS.CHIP_ROCK),
		sourceStat: [Stat.RESISTANCE],
		targetStat: [],
		duration: 2,
		minRange: 0,
		maxRange: 4,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_MOTIVATION]: new Chip({
		id: LS.CHIP_MOTIVATION,
		types: [ChipType.BUFF],
		cost: LS.getChipCost(LS.CHIP_MOTIVATION),
		minValues: [3],
		maxValues: [3],
		cooldown: LS.getChipCooldown(LS.CHIP_MOTIVATION),
		sourceStat: [],
		targetStat: [Stat.TP],
		duration: 2,
		minRange: 0,
		maxRange: 5,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_STRETCHING]: new Chip({
		id: LS.CHIP_STRETCHING,
		types: [ChipType.BUFF],
		cost: LS.getChipCost(LS.CHIP_STRETCHING),
		minValues: [80],
		maxValues: [100],
		cooldown: LS.getChipCooldown(LS.CHIP_STRETCHING),
		sourceStat: [],
		targetStat: [Stat.AGILITY],
		duration: 2,
		minRange: 0,
		maxRange: 5,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_WALL]: new Chip({
		id: LS.CHIP_WALL,
		types: [ChipType.RELATIVE],
		cost: LS.getChipCost(LS.CHIP_WALL),
		minValues: [5],
		maxValues: [6],
		cooldown: LS.getChipCooldown(LS.CHIP_WALL),
		sourceStat: [Stat.RESISTANCE],
		targetStat: [],
		duration: 2,
		minRange: 0,
		maxRange: 3,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_SPARK]: new Chip({
		id: LS.CHIP_SPARK,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_SPARK),
		minValues: [8],
		maxValues: [16],
		cooldown: LS.getChipCooldown(LS.CHIP_SPARK),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 10,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: false
	}),
	[LS.CHIP_CURE]: new Chip({
		id: LS.CHIP_CURE,
		types: [ChipType.HEAL],
		cost: LS.getChipCost(LS.CHIP_CURE),
		minValues: [35],
		maxValues: [43],
		cooldown: LS.getChipCooldown(LS.CHIP_CURE),
		sourceStat: [Stat.WISDOM],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_CURE),
		maxRange: LS.getChipMaxRange(LS.CHIP_CURE),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_LEATHER_BOOTS]: new Chip({
		id: LS.CHIP_LEATHER_BOOTS,
		types: [ChipType.BUFF],
		cost: LS.getChipCost(LS.CHIP_LEATHER_BOOTS),
		minValues: [2],
		maxValues: [2],
		cooldown: LS.getChipCooldown(LS.CHIP_LEATHER_BOOTS),
		sourceStat: [],
		targetStat: [Stat.MP],
		duration: 2,
		minRange: LS.getChipMinRange(LS.CHIP_LEATHER_BOOTS),
		maxRange: LS.getChipMaxRange(LS.CHIP_LEATHER_BOOTS),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_FLASH]: new Chip({
		id: LS.CHIP_FLASH,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_FLASH),
		minValues: [32],
		maxValues: [35],
		cooldown: LS.getChipCooldown(LS.CHIP_FLASH),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_FLASH),
		maxRange: LS.getChipMaxRange(LS.CHIP_FLASH),
		launchType: AoeType.PLUS,
		aoeType: AoeType.CIRCLE,
		aoeSize: 1,
		los: true
	}),
	[LS.CHIP_FLAME]: new Chip({
		id: LS.CHIP_FLAME,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_FLAME),
		minValues: [29],
		maxValues: [31],
		cooldown: LS.getChipCooldown(LS.CHIP_FLAME),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_FLAME),
		maxRange: LS.getChipMaxRange(LS.CHIP_FLAME),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_KNOWLEDGE]: new Chip({
		id: LS.CHIP_KNOWLEDGE,
		types: [ChipType.BUFF],
		cost: LS.getChipCost(LS.CHIP_KNOWLEDGE),
		minValues: [150],
		maxValues: [170],
		cooldown: LS.getChipCooldown(LS.CHIP_KNOWLEDGE),
		sourceStat: [],
		targetStat: [Stat.WISDOM],
		duration: 2,
		minRange: LS.getChipMinRange(LS.CHIP_KNOWLEDGE),
		maxRange: LS.getChipMaxRange(LS.CHIP_KNOWLEDGE),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_ROCKFALL]: new Chip({
		id: LS.CHIP_ROCKFALL,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_ROCKFALL),
		minValues: [50],
		maxValues: [58],
		cooldown: LS.getChipCooldown(LS.CHIP_ROCKFALL),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_ROCKFALL),
		maxRange: LS.getChipMaxRange(LS.CHIP_ROCKFALL),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.CIRCLE,
		aoeSize: 2,
		los: true
	}),
	[LS.CHIP_STALACTITE]: new Chip({
		id: LS.CHIP_STALACTITE,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_STALACTITE),
		minValues: [64],
		maxValues: [67],
		cooldown: LS.getChipCooldown(LS.CHIP_STALACTITE),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_STALACTITE),
		maxRange: LS.getChipMaxRange(LS.CHIP_STALACTITE),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_ICEBERG]: new Chip({
		id: LS.CHIP_ICEBERG,
		types: [ChipType.DAMAGE],
		cost: LS.getChipCost(LS.CHIP_ICEBERG),
		minValues: [82],
		maxValues: [90],
		cooldown: LS.getChipCooldown(LS.CHIP_ICEBERG),
		sourceStat: [Stat.STRENGTH],
		targetStat: [],
		duration: 0,
		minRange: LS.getChipMinRange(LS.CHIP_ICEBERG),
		maxRange: LS.getChipMaxRange(LS.CHIP_ICEBERG),
		launchType: AoeType.PLUS,
		aoeType: AoeType.CIRCLE,
		aoeSize: 2,
		los: true
	}),
	[LS.CHIP_TOXIN]: new Chip({
		id: LS.CHIP_TOXIN,
		types: [ChipType.POISON],
		cost: LS.getChipCost(LS.CHIP_TOXIN),
		minValues: [25],
		maxValues: [35],
		cooldown: LS.getChipCooldown(LS.CHIP_TOXIN),
		sourceStat: [Stat.MAGIC],
		targetStat: [],
		duration: 3,
		minRange: LS.getChipMinRange(LS.CHIP_TOXIN),
		maxRange: LS.getChipMaxRange(LS.CHIP_TOXIN),
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.CIRCLE,
		aoeSize: 2,
		los: true
	}),
	[LS.CHIP_TRANQUILIZER]: new Chip({
		id: LS.CHIP_TRANQUILIZER,
		types: [ChipType.DEBUFF],
		cost: 3,
		minValues: [0.3],
		maxValues: [0.4],
		cooldown: 0,
		sourceStat: [Stat.MAGIC],
		targetStat: [Stat.TP],
		duration: 1,
		minRange: 1,
		maxRange: 8,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.CIRCLE,
		aoeSize: 1,
		los: true
	}),
	[LS.CHIP_VENOM]: new Chip({
		id: LS.CHIP_VENOM,
		types: [ChipType.POISON],
		cost: 4,
		minValues: [15],
		maxValues: [20],
		cooldown: 1,
		sourceStat: [Stat.MAGIC],
		targetStat: [],
		duration: 3,
		minRange: 1,
		maxRange: 8,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
	[LS.CHIP_LIBERATION]: new Chip({
		id: LS.CHIP_LIBERATION,
		types: [ChipType.DEBUFF],
		cost: 5,
		minValues: [60],
		maxValues: [60],
		cooldown: 5,
		sourceStat: [],
		targetStat: [],
		duration: 0,
		minRange: 0,
		maxRange: 6,
		launchType: AoeType.CIRCLE,
		aoeType: AoeType.POINT,
		aoeSize: 0,
		los: true
	}),
};