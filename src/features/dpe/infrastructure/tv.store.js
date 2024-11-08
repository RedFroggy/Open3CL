import { tvs as tv } from '../../../tv-v2.js';
import { Log } from '../../../core/util/logger/log-service.js';

/**
 * Accès aux données des tables de valeurs
 *
 * /!\ Les tableaux des valeurs doivent souvent être ordonnés (ex: epaisseur_structure pour umur0)
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

  /**
   * Coefficient de transmission thermique du mur non isolé
   * @param enumMateriauxStructureMurId {string}
   * @param epaisseurStructure {number|undefined}
   * @return {number|undefined}
   */
  static getUmur0(enumMateriauxStructureMurId, epaisseurStructure = undefined) {
    const umur0 = tv['umur0']
      .filter((v) => v.enum_materiaux_structure_mur_id === enumMateriauxStructureMurId)
      .find(
        (v, idx, items) =>
          !v.epaisseur_structure ||
          !epaisseurStructure ||
          !items[idx + 1] ||
          epaisseurStructure < parseFloat(items[idx + 1].epaisseur_structure)
      )?.umur0;

    if (!umur0) {
      Log.error(
        `Pas de valeur forfaitaire umur0 pour enumMateriauxStructureMurId:${enumMateriauxStructureMurId}`
      );
      return;
    }

    Log.debug(`umur0 pour enumMateriauxStructureMurId ${enumMateriauxStructureMurId} = ${umur0}`);
    return parseFloat(umur0);
  }

  /**
   * Coefficient de transmission thermique du mur
   * @param enumPeriodeConstructionId {string}
   * @param enumZoneClimatiqueId {string}
   * @param effetJoule {boolean}
   * @return {number|undefined}
   */
  static getUmur(enumPeriodeConstructionId, enumZoneClimatiqueId, effetJoule = false) {
    const umur = tv['umur'].find(
      (v) =>
        v.enum_periode_construction_id.split('|').includes(enumPeriodeConstructionId) &&
        v.enum_zone_climatique_id.split('|').includes(enumZoneClimatiqueId) &&
        effetJoule === (parseInt(v.effet_joule) === 1)
    )?.umur;

    if (!umur) {
      Log.error(
        `Pas de valeur forfaitaire umur pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}`
      );
      return;
    }

    Log.debug(
      `umur pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId} = ${umur}`
    );
    return parseFloat(umur);
  }

  /**
   * Coefficient de transmission thermique du plancher bas
   * @param enumTypePlancherBasId {string}
   * @return {number|undefined}
   */
  static getUpb0(enumTypePlancherBasId) {
    const upbO = tv['upb0'].find(
      (v) => v.enum_type_plancher_bas_id === enumTypePlancherBasId
    )?.upb0;

    if (!upbO) {
      Log.error(
        `Pas de valeur forfaitaire upbO pour enumTypePlancherBasId:${enumTypePlancherBasId}`
      );
      return;
    }

    Log.debug(`upbO pour enumTypePlancherBasId ${enumTypePlancherBasId} = ${upbO}`);
    return parseFloat(upbO);
  }

  /**
   * Coefficient de transmission thermique du plancher bas
   * @param enumPeriodeConstructionId {string}
   * @param enumZoneClimatiqueId {string}
   * @param effetJoule {boolean}
   * @return {number|undefined}
   */
  static getUpb(enumPeriodeConstructionId, enumZoneClimatiqueId, effetJoule = false) {
    const upb = tv['upb'].find(
      (v) =>
        v.enum_periode_construction_id.split('|').includes(enumPeriodeConstructionId) &&
        v.enum_zone_climatique_id.split('|').includes(enumZoneClimatiqueId) &&
        effetJoule === (parseInt(v.effet_joule) === 1)
    )?.upb;

    if (!upb) {
      Log.error(
        `Pas de valeur forfaitaire upb pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}`
      );
      return;
    }

    Log.debug(
      `upb pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId} = ${upb}`
    );
    return parseFloat(upb);
  }

  /**
   * Retourne la valeur UE la plus proche
   * @param enumTypeAdjacenceId {string}
   * @param enumPeriodeConstructionId {string}
   * @param dsp {number} Valeur entière la plus proche de 2S/P
   * @param upb {number} Valeur de upb
   * @return {number|undefined}
   */
  static getUeByUpd(enumTypeAdjacenceId, enumPeriodeConstructionId, dsp, upb) {
    const ueRange =
      tv['ue'].filter(
        (v) =>
          parseInt(v['2s_p']) === dsp &&
          v.enum_type_adjacence_id.split('|').includes(enumTypeAdjacenceId) &&
          v.enum_periode_construction_id.split('|').includes(enumPeriodeConstructionId)
      ) || [];
    let ue;

    // Rechercher les valeurs les plus proches
    for (let idx = 0; idx < ueRange.length; idx++) {
      const u = ueRange[idx];
      if (parseFloat(u.upb) === upb) {
        ue = parseFloat(u.ue);
        break;
      }
      if (parseFloat(u.upb) < upb && idx > 0) {
        const maxUe = ueRange[idx - 1];
        const minUe = u;
        ue =
          Math.round(
            (parseFloat(minUe.ue) +
              ((parseFloat(maxUe.ue) - parseFloat(minUe.ue)) * (upb - parseFloat(minUe.upb))) /
                (parseFloat(maxUe.upb) - parseFloat(minUe.upb))) *
              100
          ) / 100;
        break;
      }
    }

    if (!ue) {
      Log.error(
        `Pas de valeur forfaitaire ue pour enumTypeAdjacenceId:${enumTypeAdjacenceId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}, 2S/P:${dsp}`
      );
      return;
    }

    Log.debug(
      `ue pour enumTypeAdjacenceId:${enumTypeAdjacenceId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}, 2S/P:${dsp} = ${ue}`
    );
    return parseFloat(ue);
  }

  /**
   * Coefficient de transmission thermique du plancher haut
   * @param enumTypePlancherHautId {string}
   * @return {number|undefined}
   */
  static getUph0(enumTypePlancherHautId) {
    const uph0 = tv['uph0'].find((v) =>
      v.enum_type_plancher_haut_id.split('|').includes(enumTypePlancherHautId)
    )?.uph0;

    if (!uph0) {
      Log.error(
        `Pas de valeur forfaitaire uph0 pour enumTypePlancherHautId:${enumTypePlancherHautId}`
      );
      return;
    }

    Log.debug(`upbO pour enumTypePlancherHautId ${enumTypePlancherHautId} = ${uph0}`);
    return parseFloat(uph0);
  }

  /**
   * Coefficient de transmission thermique du plancher bas
   * @param enumPeriodeConstructionId {string}
   * @param typeToiture {('combles'|'terrasse')}
   * @param enumZoneClimatiqueId {string}
   * @param effetJoule {boolean}
   * @return {number|undefined}
   */
  static getUph(enumPeriodeConstructionId, typeToiture, enumZoneClimatiqueId, effetJoule = false) {
    const uph = tv['uph'].find(
      (v) =>
        v.enum_periode_construction_id.split('|').includes(enumPeriodeConstructionId) &&
        v.enum_zone_climatique_id.split('|').includes(enumZoneClimatiqueId) &&
        v.type_toiture === typeToiture &&
        effetJoule === (parseInt(v.effet_joule) === 1)
    )?.uph;

    if (!uph) {
      Log.error(
        `Pas de valeur forfaitaire uph pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}, typeToiture:${typeToiture}`
      );
      return;
    }

    Log.debug(
      `uph pour enumPeriodeConstructionId:${enumPeriodeConstructionId}, enumPeriodeConstructionId:${enumPeriodeConstructionId}, typeToiture:${typeToiture} = ${uph}`
    );
    return parseFloat(uph);
  }

  /**
   * Coefficient de transmission thermique du plancher bas
   * @param enumTypeVitrageId {string}
   * @param enumTypeGazLameId {string|undefined}
   * @param enumInclinaisonVitrageId {string|undefined}
   * @param vitrageVir {boolean|undefined}
   * @param epaisseurLame {number|undefined}
   * @return {number|undefined}
   */
  static getUg(
    enumTypeVitrageId,
    enumTypeGazLameId,
    enumInclinaisonVitrageId,
    vitrageVir,
    epaisseurLame
  ) {
    const ug = tv['ug'].find(
      (v) =>
        v.enum_type_vitrage_id.split('|').includes(enumTypeVitrageId) &&
        (!enumInclinaisonVitrageId ||
          v.enum_inclinaison_vitrage_id.split('|').includes(enumInclinaisonVitrageId)) &&
        (!enumTypeGazLameId || v.enum_type_gaz_lame_id.split('|').includes(enumTypeGazLameId)) &&
        (!epaisseurLame || parseFloat(v.epaisseur_lame) === epaisseurLame) &&
        (!vitrageVir || vitrageVir === (parseInt(v.vitrage_vir) === 1))
    )?.ug;

    if (!ug) {
      Log.error(
        `Pas de valeur forfaitaire ug pour enumTypeVitrageId:${enumTypeVitrageId}, enumTypeGazLameId:${enumTypeGazLameId}, enumInclinaisonVitrageId:${enumInclinaisonVitrageId}, vitrageVir:${vitrageVir}, epaisseurLame:${epaisseurLame}`
      );
      return;
    }

    Log.debug(
      `ug pour enumTypeVitrageId:${enumTypeVitrageId}, enumTypeGazLameId:${enumTypeGazLameId}, enumInclinaisonVitrageId:${enumInclinaisonVitrageId}, vitrageVir:${vitrageVir}, epaisseurLame:${epaisseurLame} = ${ug}`
    );
    return parseFloat(ug);
  }
}
