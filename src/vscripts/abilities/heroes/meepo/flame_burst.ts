import { BaseAbility, registerAbility, BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";

/** Point‑targeted AoE nuke that also slows */
@registerAbility()
export class flame_burst extends BaseAbility {
    /* NEW: AOE helpers are now typed, so it’s nice to expose them */
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    OnSpellStart(): void {
        const caster  = this.GetCaster();
        const point   = this.GetCursorPosition();
        const radius  = this.GetSpecialValueFor("radius");
        const damage  = this.GetSpecialValueFor("damage");   // clearer than GetAbilityDamage()

        /* --- Visual --- */
        const pfx = ParticleManager.CreateParticle(
            "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf",
            ParticleAttachment.CUSTOMORIGIN,
            undefined
        );
        ParticleManager.SetParticleControl(pfx, 0, point);               // origin
        ParticleManager.SetParticleControl(pfx, 1, Vector(radius, 0, 0)); // ring radius
        ParticleManager.ReleaseParticleIndex(pfx);

        /* --- Game‑play --- */
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(),
            point,
            undefined,
            radius,
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO | UnitTargetType.BASIC,    // bit‑wise OR instead of ‘+’
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false
        );  // new signature hasn’t changed since Feb 2025 patch notes :contentReference[oaicite:0]{index=0}

        for (const enemy of enemies) {
            ApplyDamage({
                attacker: caster,
                victim:   enemy,
                damage,
                damage_type: this.GetAbilityDamageType(),
                ability: this
            });

            enemy.AddNewModifier(
                caster,
                this,
                "modifier_flame_burst_slow",
                { duration: this.GetSpecialValueFor("slow_duration") }
            );
        }

        /* network‑efficient version of ‘EmitSound’ */
        EmitSoundOnLocationWithCaster(point, "Hero_Lina.DragonSlave", caster);
    }
}