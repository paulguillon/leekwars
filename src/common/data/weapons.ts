import { AoeType, Stat, WeaponType } from "../../globaux/enums";
import { LS } from "../../globaux/ls";
import { Weapon } from "../class/item/weapon";


export const PISTOL: Weapon = new Weapon(
    LS.WEAPON_PISTOL, // id
    1, // level
    1, // template
    37 // item
)
export const MACHINE_GUN: Weapon = new Weapon(
    LS.WEAPON_MACHINE_GUN, // id
    8, // level
    2, // template
    38 // item
)
export const DOUBLE_GUN: Weapon = new Weapon(
    LS.WEAPON_DOUBLE_GUN, // id
    45, // level
    3, // template
    39 // item
)
export const SHOTGUN: Weapon = new Weapon(
    LS.WEAPON_SHOTGUN, // id
    16, // level
    4, // template
    41 // item
)
export const MAGNUM: Weapon = new Weapon(
    LS.WEAPON_MAGNUM, // id
    27, // level
    5, // template
    45 // item
)
export const LASER: Weapon = new Weapon(
    LS.WEAPON_LASER, // id
    38, // level
    6, // template
    42 // item
)
export const GRENADE_LAUNCHER: Weapon = new Weapon(
    LS.WEAPON_GRENADE_LAUNCHER, // id
    135, // level
    7, // template
    43 // item
)
export const FLAME_THROWER: Weapon = new Weapon(
    LS.WEAPON_FLAME_THROWER, // id
    90, // level
    8, // template
    46 // item
)
export const DESTROYER: Weapon = new Weapon(
    LS.WEAPON_DESTROYER, // id
    85, // level
    9, // template
    40 // item
)
export const GAZOR: Weapon = new Weapon(
    LS.WEAPON_GAZOR, // id
    297, // level
    10, // template
    48 // item
)
export const ELECTRISOR: Weapon = new Weapon(
    LS.WEAPON_ELECTRISOR, // id
    211, // level
    11, // template
    44 // item
)
export const M_LASER: Weapon = new Weapon(
    LS.WEAPON_M_LASER, // id
    299, // level
    12, // template
    47 // item
)
export const B_LASER: Weapon = new Weapon(
    LS.WEAPON_B_LASER, // id
    95, // level
    13, // template
    60 // item
)
export const KATANA: Weapon = new Weapon(
    LS.WEAPON_KATANA, // id
    257, // level
    14, // template
    107 // item
)
export const BROADSWORD: Weapon = new Weapon(
    LS.WEAPON_BROADSWORD, // id
    30, // level
    15, // template
    108 // item
)
export const AXE: Weapon = new Weapon(
    LS.WEAPON_AXE, // id
    110, // level
    16, // template
    109 // item
)
export const J_LASER: Weapon = new Weapon(
    LS.WEAPON_J_LASER, // id
    153, // level
    17, // template
    115 // item
)
export const ILLICIT_GRENADE_LAUNCHER: Weapon = new Weapon(
    LS.WEAPON_ILLICIT_GRENADE_LAUNCHER, // id
    136, // level
    18, // template
    116 // item
)
export const MYSTERIOUS_ELECTRISOR: Weapon = new Weapon(
    LS.WEAPON_MYSTERIOUS_ELECTRISOR, // id
    212, // level
    19, // template
    117 // item
)
export const UNBRIDLED_GAZOR: Weapon = new Weapon(
    LS.WEAPON_UNBRIDLED_GAZOR, // id
    298, // level
    20, // template
    118 // item
)
export const REVOKED_M_LASER: Weapon = new Weapon(
    LS.WEAPON_REVOKED_M_LASER, // id
    300, // level
    21, // template
    119 // item
)
export const RIFLE: Weapon = new Weapon(
    LS.WEAPON_RIFLE, // id
    271, // level
    22, // template
    151 // item
)
export const RHINO: Weapon = new Weapon(
    LS.WEAPON_RHINO, // id
    187, // level
    23, // template
    153 // item
)
export const EXPLORER_RIFLE: Weapon = new Weapon(
    LS.WEAPON_EXPLORER_RIFLE, // id
    272, // level
    24, // template
    175 // item
)
export const LIGHTNINGER: Weapon = new Weapon(
    LS.WEAPON_LIGHTNINGER, // id
    237, // level
    25, // template
    180 // item
)
export const NEUTRINO: Weapon = new Weapon(
    LS.WEAPON_NEUTRINO, // id
    12, // level
    27, // template
    182 // item
)
export const BAZOOKA: Weapon = new Weapon(
    LS.WEAPON_BAZOOKA, // id
    169, // level
    29, // template
    184 // item
)
export const DARK_KATANA: Weapon = new Weapon(
    LS.WEAPON_DARK_KATANA, // id
    258, // level
    32, // template
    187 // item
)
export const ENHANCED_LIGHTNINGER: Weapon = new Weapon(
    LS.WEAPON_ENHANCED_LIGHTNINGER, // id
    238, // level
    33, // template
    225 // item
)
export const UNSTABLE_DESTROYER: Weapon = new Weapon(
    LS.WEAPON_UNSTABLE_DESTROYER, // id
    86, // level
    34, // template
    226 // item
)
export const SWORD: Weapon = new Weapon(
    LS.WEAPON_SWORD, // id
    75, // level
    35, // template
    277 // item
)
export const HEAVY_SWORD: Weapon = new Weapon(
    LS.WEAPON_HEAVY_SWORD, // id
    288, // level
    36, // template
    278 // item
) 

export const weapons: Weapon[] = [
	AXE,
	B_LASER,
	BAZOOKA,
	BROADSWORD,
	DARK_KATANA,
	DESTROYER,
	DOUBLE_GUN,
	ELECTRISOR,
	ENHANCED_LIGHTNINGER,
	EXPLORER_RIFLE,
	FLAME_THROWER,
	GAZOR,
	GRENADE_LAUNCHER,
	HEAVY_SWORD,
	ILLICIT_GRENADE_LAUNCHER,
	J_LASER,
	KATANA,
	LASER,
	LIGHTNINGER,
	M_LASER,
	MACHINE_GUN,
	MAGNUM,
	MYSTERIOUS_ELECTRISOR,
	NEUTRINO,
	PISTOL,
	REVOKED_M_LASER,
	RHINO,
	RIFLE,
	SHOTGUN,
	SWORD,
	UNBRIDLED_GAZOR,
	UNSTABLE_DESTROYER
];