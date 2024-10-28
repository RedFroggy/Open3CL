/**
 * Génére un contexte du logement à étudier avec des données persistées durant l'analyse
 */
export class ContexteBuilder {
  /**
   * @param dpe {any} Fichier DPE au format json
   * @return {Contexte}
   */
  static fromDpe(dpe) {
    return {
      zoneClimatiqueId: dpe.logement.meteo.enum_zone_climatique_id.toString(),
      enumPeriodeConstructionId:
        dpe.logement.caracteristique_generale.enum_periode_construction_id.toString(),
      effetJoule: ContexteBuilder.#hasEffetJoule(dpe)
    };
  }

  /**
   * Si un générateur de chauffage electrique existe, alors effet joule vaut vrai
   * @param dpe {any} Fichier DPE au format json
   * @return {boolean}
   */
  static #hasEffetJoule(dpe) {
    return (
      dpe.logement.installation_chauffage_collection?.installation_chauffage?.find((ic) =>
        ic.generateur_chauffage_collection?.generateur_chauffage?.find(
          (gc) => gc.donnee_entree.enum_type_energie_id === '1'
        )
      ) !== undefined
    );
  }
}
