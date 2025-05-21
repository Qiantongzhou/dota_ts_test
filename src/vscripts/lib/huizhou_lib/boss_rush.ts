import { BOSSES } from "./boss_data"; 
const FIRST_SPAWN_TIME = 60 * 10;   // 10 minutes in seconds
const NEXT_BOSS_DELAY = 30;         // delay after each kill

const PAUSE_DURATION   = 60;   // 1 min
const STOP_COOLDOWN    = 600;  // 10 min
    // handle so we can extend it
let  nextSpawnTime = 0;        // absolute time of the NEXT boss
let  lastStopTime  = -STOP_COOLDOWN;   // initialise so host may pause on 1st wave
let  pausedUntil   = 0;
let  spawnTimer=Timers.CreateTimer(1,()=>{});
let currentBossIndex = -1;
let currentBoss: CDOTA_BaseNPC | undefined;
export function startBossRush() {
  
  scheduleSpawn(FIRST_SPAWN_TIME);   // instead of CreateTimer directly
  Timers.CreateTimer(broadcastLoop); // continual UI sync every 0.25 s


}

/* ---------- helpers ---------- */

function scheduleSpawn(delay: number) {
  nextSpawnTime = GameRules.GetGameTime() + delay;
  spawnTimer = Timers.CreateTimer(delay, spawnNextBoss);
}

function broadcastLoop(): number {
  CustomNetTables.SetTableValue("boss_rush","state",{
    nextSpawn:    nextSpawnTime,
    pausedUntil:  pausedUntil,
    stopCooldown: lastStopTime + STOP_COOLDOWN,
  });
  return 0.25;   // repeat
}
function spawnNextBoss() {
    ++currentBossIndex;
  
    // All bosses done?  Finish the match.
    if (currentBossIndex >= BOSSES.length) {
      //endGame();
      return;
    }
  
    const info = BOSSES[currentBossIndex];
  
    // Create the unit
    const boss = CreateUnitByName(
      info.unitName,
      info.spawn,
      true,        // findClearSpace
      undefined,   // owner
      undefined,   // unitOwnerAbility
      DotaTeam.BADGUYS
    );
  
    if (!boss) {
      print(`Failed to spawn boss #${currentBossIndex}: ${info.unitName}`);
      return;
    }
  
    currentBoss = boss;
  
    // Custom stats
    boss.SetBaseMaxHealth(info.health);
    boss.SetHealth(info.health);
    boss.SetBaseDamageMin(info.damageMin);
    boss.SetBaseDamageMax(info.damageMax);
  
    // Abilities
    info.abilities.forEach((ab) => {
      const ability = boss.AddAbility(ab.name);
      if (ability!=null) ability.SetLevel(ab.level);
    });
  
    // Optional QoL: ping on minimap, announce, play spawn sound, etc.
  }

/* event from panorama */
export function onHostStopWave(event: CustomGameEventDeclarations["onHostStopWave"]) {
  const player = PlayerResource.GetPlayer(event.PlayerID);
  if (!player || !GameRules.PlayerHasCustomGameHostPrivileges(player))
    return;                                       // not the host

  const now = GameRules.GetGameTime();
  if (now < lastStopTime + STOP_COOLDOWN) return; // still on cooldown
  if (pausedUntil > now) return;                  // already paused

  lastStopTime = now;
  pausedUntil  = now + PAUSE_DURATION;

  // how much time was left before the spawn?
  const remaining = Math.max(0, nextSpawnTime - now);

  if (spawnTimer!=null) Timers.RemoveTimer(spawnTimer);
  scheduleSpawn(remaining + PAUSE_DURATION);
  
  // audio/announce optional:
  EmitGlobalSound("General.Pause");
}

/* when pause period ends we simply fall through, because
   scheduleSpawn() already extended nextSpawnTime              */
