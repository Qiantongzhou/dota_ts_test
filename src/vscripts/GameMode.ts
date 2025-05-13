import { reloadable } from "./lib/tstl-utils";
import { xpTable,drawHeroPool,loadHeroData,initNetTables } from "./lib/huizhou_lib/init";
import { heroPool } from "./lib/huizhou_lib/hero_pool";

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

    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5)
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 0)
        GameRules.GetGameModeEntity().SetCustomXPRequiredToReachNextLevel(xpTable(999))
        GameRules.GetGameModeEntity().SetUseCustomHeroLevels(true)
        GameRules.GetGameModeEntity().SetCustomHeroMaxLevel(999)
    
        GameRules.SetCustomGameSetupAutoLaunchDelay(1.0)
        GameRules.SetHeroSelectionTime(20000.0)
        GameRules.SetStrategyTime(10.0)
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
        CustomNetTables.SetTableValue( "map_info", "difficulty",0 );
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
            
            // Iterate through all player IDs
            Timers.CreateTimer(0.2, ()=>{
            for (let playerID = 0; playerID < DOTA_MAX_PLAYERS; playerID++) {
               
                if (PlayerResource.IsValidPlayerID(playerID)) {
                    const hero = PlayerResource.GetSelectedHeroEntity(playerID);
                    if (hero && hero.IsRealHero() && !hero.IsIllusion()) {
                        // Check if the hero already has the ability
                        if (!hero.HasAbility("spawn_creep")) {
                            const ability = hero.AddAbility("spawn_creep");
                            if (ability!=null) {
                                ability.SetLevel(1); // Set the ability to level 1
                            }
                        }
                    }
                }
            }}
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
        if (npc.IsRealHero() && !npc.IsIllusion()) {
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
