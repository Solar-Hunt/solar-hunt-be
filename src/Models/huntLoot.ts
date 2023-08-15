import { MonsterLoot } from "./loot";

export type HuntLoot = {
    hunt_id: number;
    loot_id: number;
    loot?: MonsterLoot[];
}

export const fillableColumns = [
    'hunt_id',
    'loot_id',
];