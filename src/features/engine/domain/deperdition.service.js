import { TvStore } from '../../dpe/infrastructure/tv.store.js';
import enums from '../../../enums.js';
import { Log } from '../../../core/util/logger/log-service.js';
import { DeperditionMurService } from './deperdition-mur.service.js';
import { DeperditionPorteService } from './deperdition-porte.service.js';
import { DeperditionPlancherBasService } from './deperdition-plancher-bas.service.js';
import { DeperditionPlancherHautService } from './deperdition-plancher-haut.service.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * @see Méthode de calcul 3CL-DPE 2021 (cotobre 2021) chapitre 3
 */
export class DeperditionService {
  /**
   * Détermination du coefficient de réduction des déperditions b
   * @see Méthode de calcul 3CL-DPE 2021 (cotobre 2021) chapitre 3.1
   *
   * @param d {DeperditionData}
   * @return {number|undefined} Retourne le coefficient de réduction des déperditions b ou undefined si le calcul est impossible
   */
  static b(d) {
    let uVue,
      zc,
      rAiuAue = undefined;

    if (
      ['8', '9', '11', '12', '13', '14', '15', '16', '17', '18', '19', '21'].includes(
        d.enumTypeAdjacenceId
      )
    ) {
      if (!d.surfaceAue || d.surfaceAue === 0) {
        return 0;
      }
      uVue = TvStore.getUVue(d.enumTypeAdjacenceId) || 0;
      rAiuAue = d.surfaceAiu / d.surfaceAue;
    }

    if (['10'].includes(d.enumTypeAdjacenceId)) {
      if (!d.zoneClimatiqueId) {
        Log.warn(
          `impossible de calculer b pour TypeAdjacenceId:${d.enumTypeAdjacenceId} sans zone climatique`
        );
        return;
      }
      zc = enums.zone_climatique[parseInt(d.zoneClimatiqueId)];
    }

    return TvStore.getB(d.enumTypeAdjacenceId, uVue, d.enumCfgIsolationLncId, rAiuAue, zc);
  }

  /**
   * Calcul des déperditions de l’enveloppe GV
   *
   * @param ctx {Contexte}
   * @param enveloppe {Enveloppe}
   *
   * @return {Deperdition}
   */
  static gv(ctx, enveloppe) {
    /**
     * @type {Deperdition}
     */
    const deperditions = {
      deperdition_baie_vitree: 0,
      deperdition_enveloppe: 0,
      deperdition_mur: 0,
      hperm: 0,
      hvent: 0,
      deperdition_plancher_bas: 0,
      deperdition_plancher_haut: 0,
      deperdition_pont_thermique: 0,
      deperdition_porte: 0,
      deperdition_renouvellement_air: 0
    };

    enveloppe.mur_collection.mur?.forEach((m) => {
      m.donnee_intermediaire = DeperditionMurService.process(ctx, m.donnee_entree);
      deperditions.deperdition_mur +=
        m.donnee_intermediaire.b *
        m.donnee_entree.surface_paroi_totale *
        m.donnee_intermediaire.umur;
    });

    enveloppe.porte_collection.porte?.forEach((p) => {
      p.donnee_intermediaire = DeperditionPorteService.process(ctx, p.donnee_entree);
      deperditions.deperdition_porte +=
        p.donnee_intermediaire.b * p.donnee_entree.surface_porte * p.donnee_intermediaire.uporte;
    });

    enveloppe.plancher_bas_collection.plancher_bas?.forEach((pb) => {
      pb.donnee_intermediaire = DeperditionPlancherBasService.process(ctx, pb.donnee_entree);
      deperditions.deperdition_plancher_bas +=
        pb.donnee_intermediaire.b *
        pb.donnee_entree.surface_paroi_opaque *
        pb.donnee_intermediaire.upb_final;
    });

    enveloppe.plancher_haut_collection.plancher_haut?.forEach((ph) => {
      ph.donnee_intermediaire = DeperditionPlancherHautService.process(ctx, ph.donnee_entree);
      deperditions.deperdition_plancher_haut +=
        ph.donnee_intermediaire.b *
        ph.donnee_entree.surface_paroi_opaque *
        ph.donnee_intermediaire.uph;
    });

    return deperditions;
  }

  /**
   * Si Année d'isolation connue alors on prend cette donnée.
   * Sinon
   *   Si Année de construction ≤74 alors Année d’isolation = 75-77
   *   Sinon Année d’isolation = Année de construction
   *
   * @param enumPeriodeIsolationId {number}
   * @param ctx {Contexte}
   * @return {string} ID de la période d'isolation
   */
  static getEnumPeriodeIsolationId(enumPeriodeIsolationId, ctx) {
    return (
      enumPeriodeIsolationId || Math.max(parseInt(ctx.enumPeriodeConstructionId), 3).toString()
    );
  }
}
