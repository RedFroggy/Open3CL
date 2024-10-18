import { TvStore } from '../../data/infrastructure/tv.store.js';
import { DeperditionService } from './deperdition.service.js';

/**
 * Calcul des déperditions de l’enveloppe GV
 * Chapitre 3.3.4 Coefficients U des portes
 *
 * Méthode de calcul 3CL-DPE 2021
 * Octobre 2021
 * @see consolide_anne…arrete_du_31_03_2021_relatif_aux_methodes_et_procedures_applicables.pdf
 *
 * Si le coefficient U des portes est connu et justifié, le saisir directement. Sinon, prendre les valeurs tabulées
 */
export class DeperditionPorteService {
  /**
   * @param ctx {Contexte}
   * @param porteDE {PorteDE}
   * @return {PorteDI}
   */
  static process(ctx, porteDE) {
    /** @type {PorteDI} */
    const di = {
      uporte: undefined,
      b: undefined
    };

    // @todo : Une porte vitrée avec plus de 60% de vitrage est traitée comme une porte-fenêtre avec soubassement.

    if (['2', '3'].includes(porteDE.enum_methode_saisie_uporte_id)) {
      // valeur justifiée saisie à partir des documents justificatifs autorisés
      // saisie direct U depuis RSET/RSEE( etude RT2012/RE2020)
      di.uporte = porteDE.uporte_saisi;
    } else {
      // valeur forfaitaire
      di.uporte = TvStore.getUPorte(porteDE.enum_type_porte_id);
    }

    di.b = DeperditionService.b({
      enumTypeAdjacenceId: porteDE.enum_type_adjacence_id,
      surfaceAiu: porteDE.surface_aiu,
      surfaceAue: porteDE.surface_aue,
      enumCfgIsolationLncId: porteDE.enum_cfg_isolation_lnc_id,
      zoneClimatiqueId: ctx.zoneClimatiqueId
    });

    return di;
  }
}
