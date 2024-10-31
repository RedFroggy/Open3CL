import { DeperditionService } from './deperdition.service.js';
import { TvStore } from '../../dpe/infrastructure/tv.store.js';
import { PRECISION } from './constants.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * Chapitre 3.2.3 Calcul des planchers haut
 *
 * Méthode de calcul 3CL-DPE 2021
 * Octobre 2021
 * @see consolide_anne…arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf
 */
export class DeperditionPlancherHautService {
  /**
   * @param ctx {Contexte}
   * @param phDE {PlancherHautDE}
   * @return {PlancherHautDI}
   */
  static process(ctx, phDE) {
    const uph0 = DeperditionPlancherHautService.uph0(phDE);
    const uph = DeperditionPlancherHautService.uph(phDE, uph0, ctx);
    const b = DeperditionService.b({
      enumTypeAdjacenceId: phDE.enum_type_adjacence_id,
      surfaceAiu: phDE.surface_aiu,
      surfaceAue: phDE.surface_aue,
      enumCfgIsolationLncId: phDE.enum_cfg_isolation_lnc_id,
      zoneClimatiqueId: ctx.zoneClimatiqueId
    });

    /** @type {PlancherHautDI} */
    return { uph0, uph, b };
  }

  /**
   * @param phDE {PlancherHautDE}
   * @param uph0 {number}
   * @param ctx {Contexte}
   * @return {number|undefined}
   */
  static uph(phDE, uph0, ctx) {
    // On determine uph_nu (soit uph0 soit 2 comme valeur minimale forfaitaire)
    const uphNu = Math.min(uph0, 2.5);

    const enumPeriodeIsolationId = DeperditionService.getEnumPeriodeIsolationId(
      phDE.enum_periode_isolation_id,
      ctx
    );

    // Selon l'isolation, on applique un calcul au uph nu pour simuler son isolation
    let uph;
    switch (phDE.enum_methode_saisie_u_id) {
      case '1':
        // non isolé
        uph = uphNu;
        break;
      case '2':
      // isolation inconnue (table forfaitaire)
      case '7':
      // année d'isolation différente de l'année de construction
      case '8':
        // année de construction saisie
        uph = Math.min(
          uphNu,
          TvStore.getUph(
            enumPeriodeIsolationId,
            DeperditionPlancherHautService.#getTypeAdjacence(phDE),
            ctx.zoneClimatiqueId,
            ctx.effetJoule
          )
        );
        break;
      case '3':
      // epaisseur isolation saisie justifiée par mesure ou observation
      case '4':
        // epaisseur isolation saisie (en cm)
        uph = 1 / (1 / uphNu + (phDE.epaisseur_isolation * 0.01) / 0.04);
        break;
      case '5':
      case '6':
        // resistance isolation saisie
        uph = 1 / (1 / uphNu + phDE.resistance_isolation);
        break;
      default:
        // saisie direct de la valeur de u
        uph = phDE.uph_saisi;
        break;
    }

    return Math.round(parseFloat(uph) * PRECISION) / PRECISION;
  }

  /**
   * @param phDE {PlancherHautDE}
   * @return {number|undefined}
   */
  static uph0(phDE) {
    let uph0;
    switch (phDE.enum_methode_saisie_u0_id) {
      case '1':
        uph0 = TvStore.getUph0('1');
        break;
      case '2':
        uph0 = TvStore.getUph0(phDE.enum_type_plancher_haut_id);
        break;
      case '5':
        // Valeur uph saisie directement uph0 vide
        return;
      default:
        // Valeur saisie
        return phDE.uph0_saisi;
    }

    return uph0;
  }

  /**
   * Retourne le type d'adjacence à utiliser combles ou terrasse
   * @param phDE {PlancherHautDE}
   * @return {'combles'|'terasse'}
   */
  static #getTypeAdjacence(phDE) {
    switch (phDE.enum_type_adjacence_id) {
      case '1':
      case '7':
        return 'terrasse';
      default:
        return 'combles';
    }
  }
}
