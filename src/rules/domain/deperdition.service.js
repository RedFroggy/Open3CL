import { TvStore } from '../../data/infrastructure/tv.store.js';
import enums from '../../enums.js';
import { Log } from '../../core/util/logger/log-service.js';

export class DeperditionService {
  /**
   * @param d {{enumTypeAdjacenceId?: string
   *         surfaceAiu?: number,
   *         surfaceAue?: number,
   *         enumCfgIsolationLncId?: string,
   *         zoneClimatiqueId?: string}}
   * @return {number|undefined}
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
