import { DeperditionService } from './deperdition.service.js';
import { TvStore } from '../../dpe/infrastructure/tv.store.js';
import { PRECISION } from './constants.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * Chapitre 3.2.1 Calcul des Umur
 *
 * Méthode de calcul 3CL-DPE 2021
 * Octobre 2021
 * @see consolide_anne…arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf
 */
export class DeperditionMurService {
  /**
   * @param ctx {Contexte}
   * @param murDE {MurDE}
   * @return {MurDI}
   */
  static process(ctx, murDE) {
    const umur0 = DeperditionMurService.umur0(murDE);
    const umur = DeperditionMurService.umur(murDE, umur0, ctx);
    const b = DeperditionService.b({
      enumTypeAdjacenceId: murDE.enum_type_adjacence_id,
      surfaceAiu: murDE.surface_aiu,
      surfaceAue: murDE.surface_aue,
      enumCfgIsolationLncId: murDE.enum_cfg_isolation_lnc_id,
      zoneClimatiqueId: ctx.zoneClimatiqueId
    });

    /** @type {MurDI} */
    return { umur0, umur, b };
  }

  /**
   * @param murDE {MurDE}
   * @param umur0 {number}
   * @param ctx {Contexte}
   * @return {number|undefined}
   */
  static umur(murDE, umur0, ctx) {
    // On determine umur_nu (soit umur0 soit 2.5 comme valeur minimale forfaitaire)
    const umurNu = Math.min(umur0, 2.5);

    /**
     * Si Année d'isolation connue alors on prend cette données.
     * Sinon
     *   Si Année de construction ≤74 alors Année d’isolation = 75-77
     *   Sinon Année d’isolation = Année de construction
     * @type {string}
     */
    const enumPeriodeIsolationId =
      murDE.enum_periode_isolation_id ||
      Math.max(parseInt(ctx.enumPeriodeConstructionId), 3).toString();

    // Selon l'isolation, on applique un calcul au mur nu pour simuler son isolation
    let umur;
    switch (murDE.enum_methode_saisie_u_id) {
      case '1':
        // non isolé
        umur = umurNu;
        break;
      case '2':
      // isolation inconnue (table forfaitaire)
      case '7':
      // année d'isolation différente de l'année de construction
      case '8':
        // année de construction saisie
        umur = Math.min(
          umurNu,
          TvStore.getUmur(enumPeriodeIsolationId, ctx.zoneClimatiqueId, ctx.effetJoule)
        );
        break;
      case '3':
      // epaisseur isolation saisie justifiée par mesure ou observation
      case '4':
        // epaisseur isolation saisie (en cm)
        umur = 1 / (1 / umurNu + (murDE.epaisseur_isolation * 0.01) / 0.04);
        break;
      case '5':
      case '6':
        // resistance isolation saisie
        umur = 1 / (1 / umurNu + murDE.resistance_isolation);
        break;
      default:
        // saisie direct de la valeur de u
        umur = murDE.umur_saisi;
        break;
    }

    return Math.round(parseFloat(umur) * PRECISION) / PRECISION;
  }

  /**
   * @param murDE {MurDE}
   * @return {number|undefined}
   */
  static umur0(murDE) {
    let umur0;
    switch (murDE.enum_methode_saisie_u0_id) {
      case '1':
        umur0 = TvStore.getUmur0('1');
        break;
      case '2':
        umur0 = TvStore.getUmur0(murDE.enum_materiaux_structure_mur_id, murDE.epaisseur_structure);
        break;
      case '5':
        // Valeur u saisie directement umur0 vide
        return;
      default:
        // Valeur saisie
        return murDE.umur0_saisi;
    }

    /**
     * Pour les parois dites « anciennes », c’est-à-dire constituées de matériaux traditionnels à savoir pierres, terre, mur à
     * colombage, brique ancienne, la présence d’un enduit isolant n’est pas considérée comme une isolation. Cependant,
     * cet enduit apporte une correction d’isolation qu’il faut prendre en compte
     *
     * la paroi est une paroi ancienne sur laquelle a été appliquée un enduit isolant (Renduit=0,7m².K.W-1) 0 : non 1 : oui.
     * (Attention ! nom de propriété pas tout à fait explicite)
     * OBSOLETE > remplacé par enduit_isolant_paroi_ancienne
     */
    if (murDE.enduit_isolant_paroi_ancienne) {
      umur0 = 1 / (1 / umur0 + 0.7);
    }

    /**
     * Pour l’ensemble des parois, la présence d’un doublage apporte une résistance thermique supplémentaire
     */
    switch (murDE.enum_type_doublage_id) {
      case '1':
      // inconnu
      case '3':
        // doublage indéterminé ou lame d'air inf 15 mm
        umur0 = 1 / (1 / umur0 + 0.1);
        break;
      case '4':
      // doublage indéterminé ou lame d'air sup 15 mm
      case '5':
        // oublage connu (plâtre brique bois)
        umur0 = 1 / (1 / umur0 + 0.21);
        break;
      default:
        // absence de doublage ou
        break;
    }

    /**
     * @todo Comportement non clairement documenté
     * Dans beaucoup de cas umur0 retourné en le min entre 2.5 et la valeur trouvée,
     * mais pas de documentation sur ce point dans la méthode 3CL
     */
    return Math.min(2.5, Math.round(parseFloat(umur0) * PRECISION) / PRECISION);
  }
}
