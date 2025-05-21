/* one-time */


interface ReadyRow { ready: boolean }
const READY_KEY = (pid: PlayerID) => tostring(pid);

export function onPlayerReady(event:CustomGameEventDeclarations["player_ready"]) {
  const pid = event.player_id;
  CustomNetTables.SetTableValue("ready_table", READY_KEY(pid), <ReadyRow>{ ready: true });

  if (everyoneReady()) startCountdown(1);     // 10-second timer
}

function everyoneReady(): boolean {
  for (let pid = 0 as PlayerID; pid < 24; pid++) {
    if (!PlayerResource.IsValidPlayerID(pid)) continue;
    const row = CustomNetTables.GetTableValue("ready_table", READY_KEY(pid)) ;
    if (!row?.ready) return false;
  }
  return true;
}

function startCountdown(sec: number) {
    print("ready in "+sec+"s")
  CustomGameEventManager.Send_ServerToAllClients("all_ready", { countdown: sec });

  Timers.CreateTimer(sec, () => {print("ready in "+sec+"s");
    goToPreGameLoadout();
  });
}
function goToPreGameLoadout(){
    for (let pid = 0 as PlayerID; pid < 24; pid++) {
        if (!PlayerResource.IsValidPlayerID(pid)) continue;
        const hero = CustomNetTables.GetTableValue("player_hero_table", READY_KEY(pid)) ;
        PlayerResource.GetPlayer(pid)?.SetSelectedHero(hero.hero);
      }
    CustomGameEventManager.Send_ServerToAllClients("close_selection_panel", { });
}
