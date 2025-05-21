import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_auto_cast extends BaseModifier {
  // Declare modifier functions
  DeclareFunctions(): ModifierFunction[] {
    return [
      ModifierFunction.ON_DEATH,
      ModifierFunction.ON_RESPAWN,
      ModifierFunction.ON_TAKEDAMAGE,
      ModifierFunction.COOLDOWN_PERCENTAGE,
      ModifierFunction.MANACOST_PERCENTAGE,
      ModifierFunction.MANACOST_PERCENTAGE_STACKING,
      ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
      ModifierFunction.MOVESPEED_BONUS_CONSTANT,
      ModifierFunction.STATUS_RESISTANCE,
      ModifierFunction.GOLD_RATE_BOOST,
      ModifierFunction.EXP_RATE_BOOST,
    ];
  }

  // Define modifier states
  CheckState(): Partial<Record<ModifierState, boolean>> {
    return {
      [ModifierState.FORCED_FLYING_VISION]: true,
    };
  }

  // Modifier is not purgable
  IsPurgable(): boolean {
    return false;
  }

  // Reduce cooldowns
  GetModifierPercentageCooldown(): number {
    if (!this.GetParent().HasModifier("modifier_life_stealer_infest")) {
      return 70;
    } else {
      const ability = this.GetParent().FindAbilityByName("life_stealer_infest");
      return ability ? ability.GetSpecialValueFor("cooldown") : 0;
    }
  }

  // Reduce mana cost
  GetModifierPercentageManacost(): number {
    return 100;
  }

  GetModifierPercentageManacostStacking(): number {
    return 100;
  }

  // Handle OnCreated logic
  OnCreated(params: object): void {
    const caster = this.GetCaster();
  
    // Define ability and item pools
    const castSelf: Record<string, boolean> = {};
    const castFriend: Record<string, boolean> = {
      chen_divine_favor: true,
      omniknight_guardian_angel: true,
      // Add other abilities as needed
    };
    const noCast: Record<string, boolean> = {
      warlock_rain_of_chaos: true,
      // Add other abilities as needed
    };
    const controlCast: Record<string, boolean> = {
      puck_phase_shift: true,
      // Add other abilities as needed
    };
    const castHero: Record<string, boolean> = {
      puck_dream_coil: true,
      // Add other abilities as needed
    };
    const autoItem: string[] = [
      "item_seeds_of_serenity",
      // Add other items as needed
    ];
    const autoItemHero: string[] = [
      "item_gunblade",
      // Add other items as needed
    ];
    const autoItemCreep: string[] = [
      "item_shackles_dagger",
      // Add other items as needed
    ];
    
  
    // Start the think function
    caster?.SetContextThink("think_cast", () => {
      if (!caster.IsAlive() || caster.IsChanneling()) {
        return 0.3;
      }
  
      // Find nearby units
      const enemy = FindUnitsInRadius(
        caster.GetTeamNumber(),
        caster.GetAbsOrigin(),
        undefined,
        700,
        UnitTargetTeam.ENEMY,
        UnitTargetType.CREEP,
        UnitTargetFlags.NONE,
        FindOrder.CLOSEST,
        false
      );
  
      const goodHero = FindUnitsInRadius(
        caster.GetTeamNumber(),
        caster.GetAbsOrigin(),
        undefined,
        800,
        UnitTargetTeam.FRIENDLY,
        UnitTargetType.HERO,
        UnitTargetFlags.NONE,
        FindOrder.CLOSEST,
        false
      );
  
      const badHero = FindUnitsInRadius(
        caster.GetTeamNumber(),
        caster.GetAbsOrigin(),
        undefined,
        800,
        UnitTargetTeam.ENEMY,
        UnitTargetType.HERO,
        UnitTargetFlags.NONE,
        FindOrder.CLOSEST,
        false
      );
  
      // Auto-cast items
      for (const itemName of autoItem) {
        const item = caster.FindItemInInventory(itemName);
        if (item && item.IsCooldownReady()) {
          try {
            caster.SetCursorCastTarget(caster);
          } catch {}
          caster.CastAbilityImmediately(item, 0);
        }
      }
  
      // Auto-cast items on enemy heroes
      for (const itemName of autoItemHero) {
        const item = caster.FindItemInInventory(itemName);
        if (item && item.IsCooldownReady() && badHero.length > 0) {
          try {
            caster.SetCursorCastTarget(badHero[0]);
          } catch {}
          caster.CastAbilityImmediately(item, 0);
        }
      }
  
      // Auto-cast items on enemy creeps
      for (const itemName of autoItemCreep) {
        const item = caster.FindItemInInventory(itemName);
        if (item && item.IsCooldownReady() && enemy.length > 0) {
          try {
            caster.SetCursorCastTarget(enemy[0]);
          } catch {}
          caster.CastAbilityImmediately(item, 0);
        }
      }
  
      // Auto-cast abilities
      const abilityCount = caster.GetAbilityCount();
      for (let i = 0; i < abilityCount; i++) {
        const ability = caster.GetAbilityByIndex(i);
        if (
          ability && 
          caster.IsAlive()&&
          !ability.IsHidden() &&
          !ability.IsPassive() &&
          !ability.IsToggle() &&
          ability.GetLevel() > 0 &&
          ability.IsCooldownReady() &&
          !noCast[ability.GetName()] &&
          !caster.IsChanneling()
        ) {
          if (
            controlCast[ability.GetName()] &&
            (!ability.GetAutoCastState() || caster.IsSilenced())
          ) {
            continue;
          }
  
          if (castHero[ability.GetName()] && badHero.length > 0) {
            try {
              caster.SetCursorCastTarget(
                badHero[Math.floor(Math.random() * badHero.length)]
              );
            } catch {}
            caster.CastAbilityImmediately(ability, 0);
          } else if (castSelf[ability.GetName()]) {
            try {
              caster.SetCursorCastTarget(caster);
            } catch {}
            caster.CastAbilityImmediately(ability, 0);
          } else if (castFriend[ability.GetName()] && goodHero.length > 0) {
            try {
              caster.SetCursorCastTarget(
                goodHero[Math.floor(Math.random() * goodHero.length)]
              );
            } catch {}
            
            caster.CastAbilityImmediately(ability, 0);
          } else if (
            ability.GetBehaviorInt() == AbilityBehavior.NO_TARGET
          ) {
            caster.CastAbilityImmediately(ability, 0);
          } else if (enemy.length > 0) {
            try {
              
              caster.SetCursorCastTarget(
                enemy[Math.floor(Math.random() * enemy.length)]
              );
            } catch {}
            caster.CastAbilityImmediately(ability, 0);
          }
        }
      }
  
      return 0.3;
    }, 0);
  }
  

  // Handle OnDeath event
  OnDeath(event: ModifierInstanceEvent): void {
    // Implementation will go here
  }

  // Handle OnRespawn event
  OnRespawn(event: ModifierUnitEvent): void {
    const parent = this.GetParent();
    const unit = event.unit;

    // Define abilities that should be toggled on respawn
    const toggleAbilities = [
        "pudge_rot",
        "leshrac_pulse_nova",
        "witch_doctor_voodoo_restoration",
        "winter_wyvern_arctic_burn",
        "bloodseeker_blood_mist2"
    ];

    // Check if the respawned unit is the parent of this modifier
    if (unit === parent) {
        // If on 'pvp' map and game time exceeds 180 seconds
        if (GetMapName() === "pvp" && GameRules.GetDOTATime(false, true) > 180) {
            try {
                let respawnPosition = Vector(RandomInt(-8000, 8000), RandomInt(-8000, 8000), 128);
                let badHero = FindUnitsInRadius(
                    unit.GetTeamNumber(),
                    respawnPosition,
                    undefined,
                    1800,
                    UnitTargetTeam.ENEMY,
                    UnitTargetType.HERO,
                    UnitTargetFlags.NONE,
                    FindOrder.CLOSEST,
                    false
                );

                if (badHero.length > 0) {
                    const respawnPositions = [
                        badHero[0].GetAbsOrigin().__add(Vector(0, 1900, 0)),
                        badHero[0].GetAbsOrigin().__add(Vector(0, -1900, 0)),
                        badHero[0].GetAbsOrigin().__add(Vector(1900, 0, 0)),
                        badHero[0].GetAbsOrigin().__add(Vector(-1900, 0, 0))
                    ];

                    for (const pos of respawnPositions) {
                        const nearbyEnemies = FindUnitsInRadius(
                            unit.GetTeamNumber(),
                            pos,
                            undefined,
                            1800,
                            UnitTargetTeam.ENEMY,
                            UnitTargetType.HERO,
                            UnitTargetFlags.NONE,
                            FindOrder.CLOSEST,
                            false
                        );

                        if (nearbyEnemies.length === 0 && Math.abs(pos.x) < 8000 && Math.abs(pos.y) < 8000) {
                            respawnPosition = pos;
                            break;
                        }
                    }
                }

                FindClearSpaceForUnit(unit, respawnPosition, true);
            } catch (error) {
                print("Error in OnRespawn:", error);
            }
        }

        // Toggle specified abilities on
        for (const abilityName of toggleAbilities) {
            const ability = unit.FindAbilityByName(abilityName);
            if (ability && ability.GetLevel() > 0) {
                ability.ToggleAbility();
            }
        }

        // Remove specific modifier if present
        unit.RemoveModifierByName("modifier_bristleback_quillspray_autocast");
    }
}


  // Handle OnTakeDamage event
  OnTakeDamage(event: ModifierInstanceEvent): void {
    // Implementation will go here
  }
}
