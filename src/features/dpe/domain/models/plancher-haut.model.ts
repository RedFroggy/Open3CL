export interface PlancherHaut {
  donnee_entree?: PlancherHautDE;
  donnee_intermediaire?: PlancherHautDI;
}

export interface PlancherHautDE {
  description?: string;
  reference?: string;
  reference_lnc?: string;
  tv_coef_reduction_deperdition_id?: number; // TV
  surface_aiu?: number;
  surface_aue?: number;
  enum_cfg_isolation_lnc_id?: number; // ENUM cfg_isolation_lnc
  enum_type_adjacence_id?: number; // ENUM type_adjacence
  surface_paroi_opaque?: number;
  uph0_saisi?: number;
  tv_uph0_id?: number; // TV
  enum_type_plancher_haut_id?: number; // ENUM type_plancher_bas
  enum_methode_saisie_u0_id?: number; // ENUM methode_saisie_u0
  uph_saisi?: number;
  enum_type_isolation_id?: string; // ENUM type_isolation
  enum_periode_isolation_id?: string; // ENUM periode_isolation
  resistance_isolation?: number;
  epaisseur_isolation?: number;
  tv_uph_id?: string; // TV
  enum_methode_saisie_u_id?: string; // ENUM methode_saisie_u
}

export interface PlancherHautDI {
  uph: number;
  uph0: number;
  uph_final: number;
  b: number;
}
