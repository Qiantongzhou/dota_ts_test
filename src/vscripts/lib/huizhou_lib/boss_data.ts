/** Edit this array to change the line-up. */
interface BossInfo {
    unitName: string;
    spawn: Vector;
    health: number;
    damageMin: number;
    damageMax: number;
    abilities: { name: string; level: number }[];
  }
export const BOSSES: BossInfo[] = [
    {
      unitName: "npc_dota_boss_ursa",
      spawn: Vector(-3200, 1800, 256),
      health: 20000,
      damageMin: 250,
      damageMax: 300,
      abilities: [
        { name: "ursa_overpower_custom", level: 4 },
        { name: "ursa_fury_swipes_custom", level: 4 },
      ],
    },
    {
      unitName: "npc_dota_boss_phoenix",
      spawn: Vector(-3200, 1800, 256),
      health: 26000,
      damageMin: 300,
      damageMax: 350,
      abilities: [
        { name: "phoenix_fire_spirits_custom", level: 4 },
        { name: "phoenix_supernova_custom", level: 3 },
      ],
    },
    /* …more… */
  ];
  