export interface Porte {
  donnee_entree?: PorteDE;
  donnee_intermediaire?: PorteDI;
}

export interface PorteDE {
  description?: string;
  reference?: string;
  reference_paroi?: string;
  reference_lnc?: string;
  enum_cfg_isolation_lnc_id?: string; // ENUM cfg_isolation_lnc
  enum_type_adjacence_id?: string; // ENUM type_adjacence
  tv_coef_reduction_deperdition_id?: string; // TV
  surface_aiu?: number;
  surface_aue?: number;
  surface_porte?: number;
  tv_uporte_id?: string; // TV
  enum_methode_saisie_uporte_id?: string; // ENUM methode_saisie_uporte
  enum_type_porte_id?: string; // ENUM type_porte
  uporte_saisi?: number;
  nb_porte?: string;
  largeur_dormant?: string;
  presence_retour_isolation?: string;
  presence_joint?: boolean;
  enum_type_pose_id?: string; // ENUM type_pose
}

export interface PorteDI {
  uporte: number;
  b: number;
}
