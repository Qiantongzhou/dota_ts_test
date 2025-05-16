// -----------------------------------------------------------------------------
//  Custom-event registration  (call once in your GameMode Init)
// -----------------------------------------------------------------------------

  
  // -----------------------------------------------------------------------------
  //  Handler
  // -----------------------------------------------------------------------------
  /** Max abilities a player may lock in */
 export const MAX_ABILITIES = 10;
  
  /**
   * Called when a Panorama panel fires ability_selected.
   * Stores the pick in selected_abilitys_table and syncs to all clients.
   */
 export function OnAbilitySelected(event: CustomGameEventDeclarations["ability_selected"]): void {
    const playerId   = event.playerId;
    const ability    = event.ability as string;
  
    // ---------------------------------------------------------------------------
    // 1.  Fetch the existing list (or start a fresh one)
    // ---------------------------------------------------------------------------
    const key        = tostring(playerId);
    const currentRaw = CustomNetTables.GetTableValue("selected_abilitys_table", key);
  
    // the table arrives as object {"1":"axe_q","2":"axe_w",…} or undefined
    const current: string[] = Object.values(currentRaw as Record<string, string>)
       
  
    // ---------------------------------------------------------------------------
    // 2.  Validation – ignore duplicate or over-quota clicks
    // ---------------------------------------------------------------------------
    if (current.includes(ability) || current.length >= MAX_ABILITIES) {
      return;   // silently reject
    }
  
    // ---------------------------------------------------------------------------
    // 3.  Store the new list back into the net-table
    //     (Panorama will receive a table keyed "1"…"n")
    // ---------------------------------------------------------------------------
    current.push(ability);

  
    CustomNetTables.SetTableValue("selected_abilitys_table", key, current);
  
    // ---------------------------------------------------------------------------
    // 4.  (Optional) fire a lightweight custom event if you prefer events over
    //     net-table listeners.  Net-tables alone are usually enough.
    // ---------------------------------------------------------------------------
    CustomGameEventManager.Send_ServerToAllClients("ability_sync",{});
  }
/** Called from your custom-event listener */
export function OnAbilityRemove(
    event: CustomGameEventDeclarations["ability_unselected"]
  ): void {
    const playerId = event.player_id;
    const ability  = event.ability as string;
  
    /* 1 ─ Grab the existing row (object keyed "1","2",…) */
    const key        = tostring(playerId);
    const rawRow     = CustomNetTables.GetTableValue(
                          "selected_abilitys_table", key
                        ) as Record<string, string> | undefined;
  
    if (!rawRow) return;                                   // nothing to remove
  
    /* 2 ─ Convert object → array for easy manipulation */
    const current: string[] = Object.values(rawRow);       // ["axe_q","axe_w"]
  
    const idx = current.indexOf(ability);
    if (idx === -1) return;                                // ability not present
  
    /* 3 ─ Remove it and enforce max-ability rule (optional) */
    current.splice(idx, 1);                                // actually delete
    if (current.length > MAX_ABILITIES) {
      current.length = MAX_ABILITIES;                      // trim just in case
    }
  
  
    CustomNetTables.SetTableValue("selected_abilitys_table", key, current);
  
    /* 5 ─ Ping clients (empty payload) so they refresh, if you want the ping */
    CustomGameEventManager.Send_ServerToAllClients("ability_sync", {});
  }