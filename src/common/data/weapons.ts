import { AoeType, Stat, WeaponType } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { Weapon } from "../class/weapon";

export const DOUBLEGUN: Weapon = new Weapon(	LS.WEAPON_DOUBLE_GUN,
	"Double gun",
	[WeaponType.DAMAGE, WeaponType.POISON],
	4,
	[18, 9],
	[25, 12],
	[Stat.STRENGTH, Stat.MAGIC],
	[],
	2,
	true,
	2,
	7,
	AoeType.CIRCLE,
	AoeType.POINT,
	0
)
export const FLAMETHROWER: Weapon = new Weapon(
	LS.WEAPON_FLAME_THROWER,
	"Lance-flammes",
	[WeaponType.DAMAGE, WeaponType.POISON],
	6,
	[35, 24],
	[40, 30],
	[Stat.STRENGTH, Stat.MAGIC],
	[],
	2,
	true,
	2,
	8,
	AoeType.PLUS,
	AoeType.LASER,
	0
)
export const UNSTABLEDESTROYER: Weapon = new Weapon(
	LS.WEAPON_UNSTABLE_DESTROYER,
	"Destroyer instable",
	[WeaponType.DAMAGE, WeaponType.PASSIVE],
	6,
	[10, 50],
	[90, 150],
	[Stat.STRENGTH, Stat.AGILITY],
	[Stat.NONE, Stat.HP],
	0,
	true,
	1,
	6,
	AoeType.CIRCLE,
	AoeType.POINT,
	0
)
export const LASER: Weapon = new Weapon(
	LS.WEAPON_LASER,
	"Laser",
	[WeaponType.DAMAGE],
	6,
	[43],
	[59],
	[Stat.STRENGTH],
	[],
	0,
	true,
	2,
	9,
	AoeType.PLUS,
	AoeType.LASER,
	0
)
export const AXE: Weapon = new Weapon(
	LS.WEAPON_AXE,
	"Hache",
	[WeaponType.DAMAGE],
	6,
	[55],
	[77],
	[Stat.STRENGTH],
	[],
	0,
	true,
	1,
	1,
	AoeType.PLUS,
	AoeType.POINT,
	0
)
export const SWORD: Weapon = new Weapon(
	LS.WEAPON_SWORD,
	"Épée",
	[WeaponType.DAMAGE, WeaponType.RELATIVE],
	6,
	[50, 8],
	[60, 8],
	[Stat.STRENGTH],
	[],
	2,
	true,
	1,
	1,
	AoeType.PLUS,
	AoeType.POINT,
	0
)
export const BROADSWORD: Weapon = new Weapon(
	LS.WEAPON_BROADSWORD,
	"Glaive",
	[WeaponType.DAMAGE, WeaponType.BUFF],
	5,
	[39, 40],
	[41, 40],
	[Stat.STRENGTH],
	[Stat.NONE, Stat.STRENGTH],
	2,
	true,
	1,
	1,
	AoeType.PLUS,
	AoeType.POINT,
	0
)
export const GRENADELAUNCHER: Weapon = new Weapon(
	LS.WEAPON_GRENADE_LAUNCHER,
	"Lance-grenades",
	[WeaponType.DAMAGE],
	5,
	[55],
	[63],
	[Stat.STRENGTH],
	[],
	0,
	true,
	4,
	7,
	AoeType.CIRCLE,
	AoeType.CIRCLE,
	2
)
export const BAZOOKA: Weapon = new Weapon(
	LS.WEAPON_BAZOOKA,
	"Bazooka",
	[WeaponType.DAMAGE],
	1,
	[115],
	[123],
	[Stat.STRENGTH],
	[],
	0,
	true,
	4,
	6,
	AoeType.CROSS,
	AoeType.CIRCLE,
	3
)

export const weapons: Weapon[] = [DOUBLEGUN, FLAMETHROWER, UNSTABLEDESTROYER, LASER, AXE, SWORD, BROADSWORD, GRENADELAUNCHER, BAZOOKA];