/**
 * This file contains some general types related to your game that can be shared between
 * front-end (Panorama) and back-end (VScripts). Only put stuff in here you need to share.
 */

interface Color {
    r: number,
    g: number,
    b: number
}

interface UnitData {
    name: string,
    level: number
}
interface HeroData {
    AttributePrimary: string;
    AttributeBaseStrength: number;
    AttributeBaseAgility: number;
    AttributeBaseIntelligence: number;
    AttributeStrengthGain: number;
    AttributeAgilityGain: number;
    AttributeIntelligenceGain: number;
    AttackDamageMin: number;
    AttackDamageMax: number;
    ArmorPhysical: number;
    MovementSpeed: number;
    AttackRate: number;
    BaseAttackSpeed: number;
    AttackRange: number;
    StatusHealth: number;
    StatusHealthRegen: number;
    StatusMana: number;
    StatusManaRegen: number;
    // Add other properties as needed
  }

//you have to set custom net table here
interface CustomNetTableDeclarations {
    map: Record<string,{difficulty: number}>;
    difficulty_pool: { list: number[] };
    vote_table:{
        value:Record<PlayerID,number>
    }
    hero_data_table: Record<string,Record<string, HeroInfo>>;
    hero_table: Record<string, number[]>;
    selected_abilitys_table: Record<string, string[]>;
    ability_pool:Record<string,Record<string, string[]>>;
    player_hero_table:Record<string,{hero:string}>;
        /*  TRUE when a player clicks READY  */
    ready_table     : Record<string, { ready: boolean }>;
    boss_rush: {
        /** Updated ~4 × sec so Panorama can draw a bar. */
        state: {
          nextSpawn: number;     // absolute GameTime seconds
          pausedUntil: number;   // 0 if not paused, otherwise resume-time
          stopCooldown: number;  // absolute GameTime when host may click again
        };
      };

}
// hero_loader.ts  – server-side (VS Lua or TypeScript) -------------------------
interface HeroInfo {
    heroName:       string;
    primaryAttr:    "str" | "agi" | "int" | "uni";
    avgBaseDamage:  number;      // rounded
    baseStr:        number;
    baseAgi:        number;
    baseInt:        number;
    moveSpeed:      number;
    armor:          number;
    attackRate:     number;
  }