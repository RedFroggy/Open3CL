import { ContexteBuilder } from './contexte.builder.js';

export class EngineService {
  /**
   * Applique la méthode 3CL à l'entrée du DPE
   * @param dpe {Dpe}
   * @return {Dpe} Nouveau DPE avec les données intermédiaires et les sorties calculées
   */
  static process(dpe) {
    const proceededDpe = JSON.parse(JSON.stringify(dpe));
    const ctx = ContexteBuilder.fromDpe(proceededDpe);

    // Calcul de l'inertie

    // Calcul des déperditions

    // Calcul des déperditions par renouvellement de l'air

    // Calcul de l'intermittence

    // Calcul des apports gratuit

    // Calcul des besoins de chauffage

    // Calcul des rendements des installations

    // Calcul des rendements des générations

    // Calcul des rendements des générateurs ECS

    // Calcul des consommations chauffage

    // Calcul des consommations de froid

    // Calcul des consommations ECS

    // Calcul des consommations d'auxiliaires des installations de chauffage et ECS

    // Calcul des consommations d'auxiliaires de ventilation

    // Calcul des consommations éclairage et production d'électricités

    // Calcul du DPE dans le collectif

    return proceededDpe;
  }
}
