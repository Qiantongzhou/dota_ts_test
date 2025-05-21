import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter";
import { modifier_auto_cast } from "../modifiers/modifier_auto_cast";

@registerAbility()
export class spawn_creep extends BaseAbility {


  GetIntrinsicModifierName(): string {
    return modifier_auto_cast.name;
  }

  OnToggle(): void {
    // Optional: Implement toggle behavior if needed
  }

  Init(): void {
    this.SetContextThink(
      "think_set_level",
      () => {
        this.SetLevel(1);
        return undefined;
      },
      0
    );

    this.SetContextThink(
      "think_spawn_creep",
      () => {
        const caster = this.GetCaster();
        const playerID = caster.GetPlayerOwnerID();
        const spawnTime = 0.4;

        if (
          caster.IsAlive() &&
          !GameRules.IsGamePaused() &&
          PlayerResource.GetConnectionState(playerID) ===
            ConnectionState.CONNECTED &&
          GameRules.State_Get() === GameState.GAME_IN_PROGRESS &&
          this.GetAutoCastState()
        ) {
          const creepName = "npc_dota_dark_troll_warlord_skeleton_warrior";
          const creepCounter = 20;

          const neutrals = FindUnitsInRadius(
            caster.GetTeamNumber(),
            caster.GetAbsOrigin(),
            undefined,
            1800,
            UnitTargetTeam.ENEMY,
            UnitTargetType.CREEP | UnitTargetType.BASIC,
            UnitTargetFlags.NONE,
            FindOrder.CLOSEST,
            false
          );

          if (neutrals.length < creepCounter) {
            let pos = caster.GetAbsOrigin().__add(RandomVector(1000));

            pos.x = Math.max(Math.min(pos.x, 8000), -8000);
            pos.y = Math.max(Math.min(pos.y, 8000), -8000);

            const creep = CreateUnitByName(
              creepName,
              pos,
              true,
              undefined,
              undefined,
              DotaTeam.NEUTRALS
            );

            if (creep!=null) {
              // creep.AddNewModifier(
              //   creep,
              //   undefined,
              //   "modifier_creep_upgrade",
              //   {}
              // );
              creep.SetForceAttackTarget(caster);
            }
          }
        }

        // Handle out-of-bounds
        if (caster.GetAbsOrigin().z < -1000) {
          let pos = caster.GetAbsOrigin();

          pos.x = Math.max(Math.min(pos.x, 8000), -8000);
          pos.y = Math.max(Math.min(pos.y, 8000), -8000);

          FindClearSpaceForUnit(caster, pos, true);
        }

        return spawnTime;
      },
      0
    );
  }
}
