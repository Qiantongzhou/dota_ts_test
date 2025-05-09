/**
 * Build an XP lookup table whose indices correspond to hero levels.
 *
 * @param maxLvl – highest level you want to support
 * @returns number[] where `xpTable[n]` is the total XP required to reach level n
 */
/**********************************************************************
 *  globals.ts
 *  ─ A minimal, strongly‑typed port of the original Lua utility file ─
 *********************************************************************/


  /* ------------------------------------------------------------------ */
  /* Global state                                                       */
  /* ------------------------------------------------------------------ */
  
  export let bossDifficultyTable: Record<PlayerID, number> ;
  export let   bossDifficulty = 0;
  
  /* ------------------------------------------------------------------ */
  /* 1.  Difficulty voting (was: select_difficulty)                      */
  /* ------------------------------------------------------------------ */
  
  /**
   * Handle a client vote packet: { PlayerID, difficulty }
   *
   * The host’s vote counts as 3; every other player counts as 1.  
   * Result is broadcast both via a custom game‑event and a NetTable.
   */
  export function selectDifficulty(data: { PlayerID: PlayerID; difficulty: number }): void {
    /* 1‑A. Save the vote and echo it back so clients update their UI */
    bossDifficultyTable[data.PlayerID] = data.difficulty;
    CustomNetTables.SetTableValue("vote_table", "value", bossDifficultyTable);
  
    /* 1‑B. In‑chat feedback */
    GameRules.SendCustomMessage(`difficulty${data.difficulty}`, 0, 0);
  
    const voter = PlayerResource.GetPlayer(data.PlayerID);
    if (voter && GameRules.PlayerHasCustomGameHostPrivileges(voter)) {
      GameRules.SendCustomMessage("tip_host_vote", 0, 0);
    }
  
    /* 1‑C. Tally the votes (levels 0‑9) */
    let bestDifficulty = 0;
    let bestScore      = 0;
  
    for (let lvl = 0; lvl <= 9; ++lvl) {
      let score = 0;
  
      for (const [pidStr, diff] of Object.entries(bossDifficultyTable)) {
        if (diff === lvl) {
          const pid   = (pidStr as unknown) as PlayerID;
          const ply   = PlayerResource.GetPlayer(pid);
          const hostBonus = ply && GameRules.PlayerHasCustomGameHostPrivileges(ply) ? 3 : 1;
          score += hostBonus;
        }
      }
  
      if (score > bestScore) {
        bestDifficulty = lvl;
        bestScore      = score;
      }
    }
  
    /* 1‑D. Store + broadcast the final result */
    bossDifficulty = bestDifficulty;
    CustomGameEventManager.Send_ServerToAllClients("selected_difficulty", { value: bestDifficulty });
    CustomNetTables.SetTableValue("map_info", "difficulty",  bestDifficulty);
  }



  /* ------------------------------------------------------------------ */
  /* 2.  Random 30‑hero pool (was: draw_hero_pool)                       */
  /* ------------------------------------------------------------------ */
  
  /**
   * Pull 30 distinct hero indices (0‑based) out of the canonical 124‑hero list.
   * @returns number[] — array of 30 ints you can send to the client.
   */
  export function drawHeroPool(): number[] {
    const totalPool: number[] = [];
    for (let i = 1; i <= 124; ++i) totalPool.push(i);
  
    const playerPool: number[] = [];
    for (let i = 0; i < 30; ++i) {
      const idx = RandomInt(1, totalPool.length) - 1;        // RandomInt is inclusive, Lua‑style
      const heroId = totalPool.splice(idx, 1)[0];
      playerPool.push(heroId - 1);                           // convert to 0‑based just like the Lua code
    }
  
    return playerPool;
  }
  
  /* ------------------------------------------------------------------ */
  /* 3.  Hero stat NetTable (was: load_hero_data)                        */
  /* ------------------------------------------------------------------ */
  
  /**
   * Push a bunch of static hero information to the “hero_data_table” NetTable so
   * the panorama UI can read it without extra C‐to‐JS calls.
   *
   * @param heroPool array of hero names (e.g. "npc_dota_hero_axe")
   */
  export function loadHeroData(heroPool: string[]): void {
    for (const heroName of heroPool) {
      let h = DOTAGameManager.GetHeroDataByName_Script(heroName )as HeroData;
  
      /* Average base damage (matches the Lua logic) ------------------ */
      let avgDmg = (h.AttackDamageMin + h.AttackDamageMax) / 2;
      switch (h.AttributePrimary) {
        case "DOTA_ATTRIBUTE_STRENGTH":
          avgDmg += h.AttributeBaseStrength;
          break;
        case "DOTA_ATTRIBUTE_AGILITY":
          avgDmg += h.AttributeBaseAgility;
          break;
        case "DOTA_ATTRIBUTE_INTELLECT":
          avgDmg += h.AttributeBaseIntelligence;
          break;
        default:
          avgDmg += (h.AttributeBaseStrength + h.AttributeBaseAgility + h.AttributeBaseIntelligence) * 0.7;
      }
  
      /* Assemble the record exactly like the original keys ------------ */
      const record: Record<string, string> = {
        HeroType: h.AttributePrimary,
  
        AttributeBaseStrength:  `${h.AttributeBaseStrength}`,
        AttributeBaseAgility:   `${h.AttributeBaseAgility}`,
        AttributeBaseIntelligence: `${h.AttributeBaseIntelligence}`,
  
        AttributeStrengthGain:  h.AttributeStrengthGain.toFixed(2),
        AttributeAgilityGain:   h.AttributeAgilityGain.toFixed(2),
        AttributeIntelligenceGain: h.AttributeIntelligenceGain.toFixed(2),
  
        AttackDamage:           avgDmg.toFixed(0),
        ArmorPhysical:          (h.ArmorPhysical + h.AttributeBaseAgility / 6).toFixed(1),
  
        MovementSpeed:          `${h.MovementSpeed}`,
        AttackRate:             h.AttackRate.toFixed(2),
        BaseAttackSpeed:        `${h.BaseAttackSpeed}`,
        AttackRange:            `${h.AttackRange}`,
  
        StatusHealth:           `${h.StatusHealth + h.AttributeBaseStrength * 22}`,
        StatusHealthRegen:      (h.StatusHealthRegen + h.AttributeBaseStrength * 0.1).toFixed(1),
  
        StatusMana:             `${h.StatusMana + h.AttributeBaseIntelligence * 12}`,
        StatusManaRegen:        (h.StatusManaRegen + h.AttributeBaseIntelligence * 0.05).toFixed(1),
      };
  
      CustomNetTables.SetTableValue("hero_data_table", heroName, record);
    }
  }
  
export function xpTable(maxLvl: number): number[] {
    const xpTable: number[] = [];
  
    /* Hard‑coded Valve numbers for levels 0‑24 */
    xpTable[0]  = 0;
    xpTable[1]  = 230;
    xpTable[2]  = 600;
    xpTable[3]  = 1_080;
    xpTable[4]  = 1_660;
    xpTable[5]  = 2_260;
    xpTable[6]  = 2_980;
    xpTable[7]  = 3_730;
    xpTable[8]  = 4_510;
    xpTable[9]  = 5_320;
    xpTable[10] = 6_160;
    xpTable[11] = 7_030;
    xpTable[12] = 7_930;
    xpTable[13] = 9_155;
    xpTable[14] = 10_405;
    xpTable[15] = 11_680;
    xpTable[16] = 12_980;
    xpTable[17] = 14_305;
    xpTable[18] = 15_805;
    xpTable[19] = 17_395;
    xpTable[20] = 18_995;
    xpTable[21] = 20_845;
    xpTable[22] = 22_945;
    xpTable[23] = 25_295;
    xpTable[24] = 27_895;
  
    /* Valve’s “linear‑plus” formula for 25+ */
    for (let i = 25; i <= maxLvl; ++i) {
      xpTable[i] = xpTable[i - 1] + (i - 24) * 1_000 + 2_500;
    }
  
    return xpTable;
  }
  