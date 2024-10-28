export interface Climatisation {
  donnee_entree?: ClimatisationDE;
  donnee_intermediaire?: ClimatisationDI;
}

export interface ClimatisationDE {
  description?: string;
  reference: string;
  tv_seer_id?: number;
  nombre_logement_echantillon?: number;
  enum_methode_calcul_conso_id: number;
  enum_periode_installation_fr_id: number;
  cle_repartition_clim?: number;
  enum_type_generateur_fr_id: number;
  enum_type_energie_id?: number;
  enum_methode_saisie_carac_sys_id: number;
  ref_produit_fr?: string;
}

export interface ClimatisationDI {
  eer: number;
  besoin_fr: number;
  conso_fr: number;
  conso_fr_depensier: number;
}
