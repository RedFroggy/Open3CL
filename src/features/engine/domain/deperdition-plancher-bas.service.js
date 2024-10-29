import { DeperditionService } from './deperdition.service.js';
import { TvStore } from '../../dpe/infrastructure/tv.store.js';
import { PRECISION } from './constants.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * Chapitre 3.2.2 Calcul des planchers bas
 *
 * Méthode de calcul 3CL-DPE 2021
 * Octobre 2021
 * @see consolide_anne…arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf
 */
export class DeperditionPlancherBasService {
  /**
   * @param ctx {Contexte}
   * @param pbDE {PlancherBasDE}
   * @return {PlancherBasDI}
   */
  static process(ctx, pbDE) {
    const upb0 = DeperditionPlancherBasService.upb0(pbDE);
    const upb = DeperditionPlancherBasService.upb(pbDE, upb0, ctx);
    const upb_final = DeperditionPlancherBasService.upbFinal(pbDE, upb, ctx);
    const b = DeperditionService.b({
      enumTypeAdjacenceId: pbDE.enum_type_adjacence_id,
      surfaceAiu: pbDE.surface_aiu,
      surfaceAue: pbDE.surface_aue,
      enumCfgIsolationLncId: pbDE.enum_cfg_isolation_lnc_id,
      zoneClimatiqueId: ctx.zoneClimatiqueId
    });

    /** @type {PlancherBasDI} */
    return { upb0, upb, upb_final, b };
  }

  /**
   * @param pbDE {PlancherBasDE}
   * @param upb0 {number}
   * @param ctx {Contexte}
   * @return {number|undefined}
   */
  static upb(pbDE, upb0, ctx) {
    // On determine upb_nu (soit upb0 soit 2 comme valeur minimale forfaitaire)
    const upbNu = Math.min(upb0, 2);

    const enumPeriodeIsolationId = DeperditionService.getEnumPeriodeIsolationId(
      pbDE.enum_periode_isolation_id,
      ctx
    );

    // Selon l'isolation, on applique un calcul au upb nu pour simuler son isolation
    let upb;
    switch (pbDE.enum_methode_saisie_u_id) {
      case '1':
        // non isolé
        upb = upbNu;
        break;
      case '2':
      // isolation inconnue (table forfaitaire)
      case '7':
      // année d'isolation différente de l'année de construction
      case '8':
        // année de construction saisie
        upb = Math.min(
          upbNu,
          TvStore.getUpb(enumPeriodeIsolationId, ctx.zoneClimatiqueId, ctx.effetJoule)
        );
        break;
      case '3':
      // epaisseur isolation saisie justifiée par mesure ou observation
      case '4':
        // epaisseur isolation saisie (en cm)
        upb = 1 / (1 / upbNu + (pbDE.epaisseur_isolation * 0.01) / 0.042);
        break;
      case '5':
      case '6':
        // resistance isolation saisie
        upb = 1 / (1 / upbNu + pbDE.resistance_isolation);
        break;
      default:
        // saisie direct de la valeur de u
        upb = pbDE.upb_saisi;
        break;
    }

    return Math.round(parseFloat(upb) * PRECISION) / PRECISION;
  }

  /**
   * @param pbDE {PlancherBasDE}
   * @return {number|undefined}
   */
  static upb0(pbDE) {
    let upb0;
    switch (pbDE.enum_methode_saisie_u0_id) {
      case '1':
        upb0 = TvStore.getUpb0('1');
        break;
      case '2':
        upb0 = TvStore.getUpb0(pbDE.enum_type_plancher_bas_id);
        break;
      case '5':
        // Valeur upb saisie directement upb0 vide
        return;
      default:
        // Valeur saisie
        return pbDE.upb0_saisi;
    }

    return upb0;
  }

  /**
   * Pour les vides sanitaires, les sous-sol non chauffés et terre-plein, le calcul des déperditions se fait avec un coefficient
   * Ue en remplacement de Upb.
   *
   * @param pbDE {PlancherBasDE}
   * @param upb {number}
   * @param ctx {Contexte}
   * @return {number|undefined}
   */
  static upbFinal(pbDE, upb, ctx) {
    if (pbDE.calcul_ue === 1) {
      return pbDE.ue;
    }

    if (!['3', '5', '6'].includes(pbDE.enum_type_adjacence_id)) {
      return upb;
    }

    const dsp = Math.round((2 * pbDE.surface_ue) / pbDE.perimetre_ue);
    const upbFinal = TvStore.getUeByUpd(
      pbDE.enum_type_adjacence_id,
      ctx.enumPeriodeConstructionId,
      dsp,
      upb
    );

    return Math.round(parseFloat(upbFinal) * PRECISION) / PRECISION;
  }
}
