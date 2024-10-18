import { tvs as tv } from '../../tv-v2.js';
import { Log } from '../../core/util/logger/log-service.js';

/**
 * Accès aux données des tables de valeurs
 */
export class TvStore {
  /**
   * Coefficients U des portes
   * Si le coefficient U des portes est connu et justifié, le saisir directement. Sinon, prendre les valeurs forfaitaires
   *
   * @see Chapitre 3.3.4
   *
   * @param enumTypePorteId {string} Identifiant du type de porte
   * @return {number|undefined} Uporte si trouvé, sinon undefined
   */
  static getUPorte(enumTypePorteId) {
    const uPorte = tv['uporte'].find((v) =>
      v.enum_type_porte_id.split('|').includes(enumTypePorteId)
    )?.uporte;

    if (!uPorte) {
      Log.error(`Pas de valeur forfaitaire uPorte pour enumTypePorteId:${enumTypePorteId}`);
      return;
    }

    Log.debug(`uPorte pour type ${enumTypePorteId} = ${uPorte}`);
    return parseFloat(uPorte);
  }

  /**
   * Coefficient de réduction des déperditions b
   * @param enumTypeAdjacenceId {string}
   * @param uVue {number|undefined}
   * @param enumCfgIsolationLncId {string|undefined}
   * @param rAiuAue {number|undefined}
   * @param zc {string|undefined}
   * @return {number|undefined}
   */
  static getB(
    enumTypeAdjacenceId,
    uVue = undefined,
    enumCfgIsolationLncId = undefined,
    rAiuAue = undefined,
    zc = undefined
  ) {
    const b = tv['coef_reduction_deperdition'].find(
      (v) =>
        v.enum_type_adjacence_id.split('|').includes(enumTypeAdjacenceId) &&
        (!uVue || !v.uvue || parseFloat(v.uvue) === uVue) &&
        (!enumCfgIsolationLncId ||
          !v.enum_cfg_isolation_lnc_id ||
          v.enum_cfg_isolation_lnc_id === enumCfgIsolationLncId) &&
        (!zc ||
          !v.zone_climatique ||
          zc.toLowerCase().startsWith(v.zone_climatique.toLowerCase())) &&
        (!rAiuAue ||
          ((!v.aiu_aue_min || v.aiu_aue_min < rAiuAue) &&
            (!v.aiu_aue_max || v.aiu_aue_max >= rAiuAue)))
    )?.b;

    if (!b) {
      Log.error(`Pas de valeur forfaitaire b pour enumTypeAdjacenceId:${enumTypeAdjacenceId}`);
      return;
    }

    Log.debug(`b pour enumTypeAdjacenceId ${enumTypeAdjacenceId} = ${b}`);
    return parseFloat(b);
  }

  /**
   * Coefficient surfacique équivalent
   * @param enumTypeAdjacenceId {string}
   * @return {number|undefined}
   */
  static getUVue(enumTypeAdjacenceId) {
    const uvue = tv['uvue'].find((v) => v.enum_type_adjacence_id === enumTypeAdjacenceId)?.uvue;

    if (!uvue) {
      Log.error(`Pas de valeur forfaitaire uVue pour enumTypeAdjacenceId:${enumTypeAdjacenceId}`);
      return;
    }

    Log.debug(`uvue pour enumTypeAdjacenceId ${enumTypeAdjacenceId} = ${uvue}`);
    return parseFloat(uvue);
  }
}
