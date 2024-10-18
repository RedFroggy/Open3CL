import { TvStore } from '../../data/infrastructure/tv.store.js';
import enums from '../../enums.js';
import { Log } from '../../core/util/logger/log-service.js';

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
}
