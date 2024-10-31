import { Log } from '../../../core/util/logger/log-service.js';

/**
 * Service de normalisation du DPE d'entrée
 * Permet de redresser / complèter des données d'entrées
 */
export class DpeNormalizerService {
  /**
   * @param dpe {Dpe}
   * @return {Dpe} Normalized DPE
   */
  static normalize(dpe) {
    /**
     * On clone le DPE d'origine pour ne pas le modifier
     * @type {Dpe}
     */
    let normalizedDpe = JSON.parse(JSON.stringify(dpe));

    // Traitement des murs
    DpeNormalizerService.#normalizeMur(normalizedDpe);

    return normalizedDpe;
  }

  /**
   * @param normalizedDpe {Dpe}
   */
  static #normalizeMur(normalizedDpe) {
    normalizedDpe.logement.enveloppe.mur_collection.mur.map((mur) => {
      // capture épaisseur dans la description du mur
      if (!mur.donnee_entree.epaisseur_structure) {
        const regexEpaisseur = /.* - Murs? en .* d'épaisseur (.*)cm/i;
        const parts = mur.donnee_entree.description.match(regexEpaisseur);
        if (parts?.length === 2) {
          Log.debug(
            `Normalisation de l'épaisseur du mur pour le DPE ${normalizedDpe.numero_dpe}, mur ${mur.donnee_entree.description}`
          );
          const epaisseur = parts[1].replace(/[ <≤≥>]/g, '');
          mur.donnee_entree.epaisseur_structure =
            mur.donnee_entree.epaisseur_structure || epaisseur;
        }
      }
    });
  }
}
