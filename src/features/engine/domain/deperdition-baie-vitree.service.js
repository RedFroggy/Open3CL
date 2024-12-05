import { DeperditionService } from './deperdition.service.js';
import { PRECISION } from './constants.js';
import { TvStore } from '../../dpe/infrastructure/tv.store.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * Chapitre 3.3 Calcul des parois vitrées
 *
 * Méthode de calcul 3CL-DPE 2021
 * Octobre 2021
 * @see consolide_anne…arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf
 */
export class DeperditionBaieVitreeService {
  /**
   * @param ctx {Contexte}
   * @param bvDE {BaieVitreeDE}
   * @return {BaieVitreeDI}
   */
  static process(ctx, bvDE) {
    const ug = DeperditionBaieVitreeService.ug(bvDE);
    const b = DeperditionService.b({
      enumTypeAdjacenceId: bvDE.enum_type_adjacence_id,
      surfaceAiu: bvDE.surface_aiu,
      surfaceAue: bvDE.surface_aue,
      enumCfgIsolationLncId: bvDE.enum_cfg_isolation_lnc_id,
      zoneClimatiqueId: ctx.zoneClimatiqueId
    });

    /** @type {BaieVitreeDI} */
    return {
      b,
      ug
      /*ug?: number;
      uw: number;
      ujn?: number;
      u_menuiserie: number;
      sw: number;
      fe1: number;
      fe2: number; */
    };
  }

  /**
   * @param bvDE {BaieVitreeDE}
   * @param ctx {Contexte}
   * @return {number|undefined}
   */
  static ug(bvDE) {
    const e = Math.min(bvDE.epaisseur_lame, 20);
    switch (bvDE.enum_methode_saisie_perf_vitrage_id) {
      case '1':
    }
    const ug = TvStore.getUg(
      bvDE.enum_type_vitrage_id,
      bvDE.enum_type_gaz_lame_id,
      bvDE.enum_inclinaison_vitrage_id,
      bvDE.vitrage_vir,
      e
    );
    return Math.round(parseFloat(ug) * PRECISION) / PRECISION;
  }
}
