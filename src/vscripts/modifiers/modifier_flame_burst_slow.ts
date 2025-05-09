// modifiers/modifier_flame_burst_slow.ts
import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
@registerModifier()
export class modifier_flame_burst_slow extends BaseModifier {
  DeclareFunctions() { return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]; }
  GetModifierMoveSpeedBonus_Percentage() { return -this.GetAbility()!.GetSpecialValueFor("slow_pct"); }
  IsDebuff() { return true; }
  GetEffectName() { return "particles/generic_gameplay/generic_slowed_cold.vpcf"; }
  GetEffectAttachType() { return ParticleAttachment.ABSORIGIN_FOLLOW; }
}
