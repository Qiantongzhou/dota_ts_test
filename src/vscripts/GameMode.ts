import { reloadable } from "./lib/tstl-utils";
import { xpTable,drawHeroPool,loadHeroData,initNetTables,selectDifficulty } from "./lib/huizhou_lib/init";
import { heroPool } from "./lib/huizhou_lib/hero_pool";
import { abilityPool } from "./lib/huizhou_lib/ability_pool";
import { onPlayerReady } from "./lib/huizhou_lib/game_ready";
import { OnAbilitySelected,OnAbilityRemove,MAX_ABILITIES} from "./lib/huizhou_lib/ability_select"
import { onHostStopWave } from "./lib/huizhou_lib/boss_rush";
declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}
  /** Per-player scratch pad for arbitrary data you want to keep on the server. */
  const playerData: Record<PlayerID, Record<string, unknown>> = {} as any;

  /** Per-player ability pool (you fill this later when abilities are rolled). */
  const playerAbilityPool: number[][] = Array.from({ length: 10 }, () => []);
  
  /** Per-player hero pool (30 heroes each, generated at start). */
  const playerHeroPool: number[][] = Array.from({ length: 10 }, () => []);
@reloadable
export class GameMode {
    
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
        PrecacheResource("particle", "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf", context);
        // 1) Gather every unique ability name into a Set
        const uniq = new Set<string>();
        for (const list of Object.keys(abilityPool)) {
             uniq.add(list);
        }

        // 2) Block-load each ability’s KV, particles & sounds
        for (const name of uniq) {
            PrecacheUnitByNameSync(name, context);   // engine loads ability & its "precache" block
            print("precache "+name)
        }
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
        this.InitGameMode();
        // Register event listeners for dota engine events
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        CustomGameEventManager.RegisterListener(
            "ability_selected",
            (_, args) => OnAbilitySelected(args as CustomGameEventDeclarations["ability_selected"])
          );
          CustomGameEventManager.RegisterListener(
            "ability_unselected",
            (_, args) => OnAbilityRemove(args as CustomGameEventDeclarations["ability_unselected"])
          );
          CustomGameEventManager.RegisterListener(
            "hero_selected", 
            (_, args) =>this.onHeroSelected(args as CustomGameEventDeclarations["hero_selected"]));
        CustomGameEventManager.RegisterListener(
            "difficulty_selected",
            (_, args) => selectDifficulty(args as CustomGameEventDeclarations["difficulty_selected"])
          );
        CustomGameEventManager.RegisterListener(
            "player_ready", 
            (_, args) =>onPlayerReady(args as CustomGameEventDeclarations["player_ready"])
        );
        CustomGameEventManager.RegisterListener(
            "onHostStopWave", 
            (_, args) =>onHostStopWave(args as CustomGameEventDeclarations["onHostStopWave"])
        );
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5)
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 0)
        GameRules.GetGameModeEntity().SetCustomXPRequiredToReachNextLevel(xpTable(999))
        GameRules.GetGameModeEntity().SetUseCustomHeroLevels(true)
        GameRules.GetGameModeEntity().SetCustomHeroMaxLevel(999)
    
        GameRules.SetCustomGameSetupAutoLaunchDelay(1.0)
        GameRules.SetHeroSelectionTime(20000.0)
        GameRules.SetStrategyTime(20.0)
        GameRules.SetPreGameTime(5000.0)
        GameRules.SetShowcaseTime(0.0)

        
    }
    private InitGameMode():void{
        for (let playerID = 0 as PlayerID; playerID < 10; ++playerID) {
            playerData[playerID] = {};
    
            playerHeroPool[playerID] = drawHeroPool();      // 30 unique heroes
            CustomNetTables.SetTableValue(
                "hero_table",
                playerID.toString(),
                playerHeroPool[playerID],
            );
        }
        //CustomNetTables.SetTableValue( "map_info", "difficulty",0 );
        loadHeroData(heroPool);
        initNetTables();
    }

    public OnStateChange(): void {
        
        const state = GameRules.State_Get();
        
        if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {

        }

        if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(3, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }
        if (state === GameState.PRE_GAME) { 
            print("prepre")
            // Iterate through all player IDs
            Timers.CreateTimer(1, ()=>{
            for (let playerID = 0; playerID < DOTA_MAX_PLAYERS; playerID++) {
               
                if (PlayerResource.IsValidPlayerID(playerID)) {
                    const hero = PlayerResource.GetSelectedHeroEntity(playerID);

                    if (hero && hero.IsRealHero() && !hero.IsIllusion()) {
 
   
                    }
                }
            }
        }
        );
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
           //Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }

    private StartGame(): void {
        print("Game starting!");

        // Do some stuff here
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        //print("OnNpcSpawned")
        const npc = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;

        // Check if the spawned unit is a real hero and not an illusion
        if(GameRules.State_Get()==GameState.PRE_GAME){
        if (npc.IsRealHero() && !npc.IsIllusion()) {
            print(npc.GetPlayerOwnerID())
            const temp = CustomNetTables.GetTableValue("selected_abilitys_table", tostring(npc.GetPlayerOwnerID()));
            const picks: string[] = Object.values(temp as Record<string, string>)
            if (!picks) return;
            print("A")
            /* 1️⃣  remove native abilities (except facets & talents) */
            for (let slot = 0; slot < 18; ++slot) {
            const ab = npc.GetAbilityByIndex(slot);
            if (!ab) continue;
            const name = ab.GetAbilityName();

            /* keep talents & attribute bonus (plain-text rule) */
            if (name.startsWith("special_bonus_") || name === "generic_hidden") continue;
            
            /* keep the new facet ability: flagged as "innate" in KV */
            //if (ab.GetAbilityType && ab.GetAbilityType() === AbilityTypes.BASIC ) continue;                            // keep facets, talents
            npc.RemoveAbility(ab.GetAbilityName());
            
            }
            /* 2️⃣  add custom picks */
            for (const abName of picks) {
            print("player "+npc.GetPlayerOwnerID()+" add ability: "+abName)
            const newAb = npc.AddAbility(abName);
            
            }
            // Ensure the ability isn't already added
            if (!npc.HasAbility("spawn_creep")) {
                const ability = npc.AddAbility("spawn_creep");
                if (ability!=null) {
                    ability.SetLevel(1); // Set the ability to level 1
                }
            }
        }
    }
    }
    
    private OnAbilitySelected(event:CustomGameEventDeclarations){

    }
    private onHeroSelected(event: CustomGameEventDeclarations["hero_selected"]) {
        const pid  = event.playerId as PlayerID;   // send this from the client
        const hero = event.hero;
      
        const key  = tostring(pid);
        const row  = CustomNetTables.GetTableValue("player_hero_table", key)
      
        /* ─── CASE 1: same hero already locked ⇒ unlock ─────────────────── */
        if (row && row.hero === hero) {
          CustomNetTables.SetTableValue("player_hero_table", key, {hero:" "}); // removes row
          takenHeroes.delete(hero);
          return;
        }
      
        /* ─── CASE 2: hero taken by someone else ────────────────────────── */
        if (takenHeroes.has(hero)) {
          return;  // or send an error event back
        }
      
        /* ─── CASE 3: accept new pick ───────────────────────────────────── */
        CustomNetTables.SetTableValue("player_hero_table", key, { hero: hero});    // ← object!
        takenHeroes.add(hero);
      }
      
}
/** Keeps track of heroes that are already taken (optional) */
const takenHeroes = new Set<string>();


