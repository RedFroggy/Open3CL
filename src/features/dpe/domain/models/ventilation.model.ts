export interface Ventilation {
  donnee_entree?: VentilationDE;
  donnee_intermediaire?: VentilationDI;
}

export interface VentilationDE {
  surface_ventile: number;
  description?: string;
  reference?: string;
  plusieurs_facade_exposee: boolean;
  tv_q4pa_conv_id?: number;
  q4pa_conv_saisi?: number;
  enum_methode_saisie_q4pa_conv_id: number;
  tv_debits_ventilation_id: number;
  ventilation_post_2012: boolean;
  ref_produit_ventilation?: number;
  cle_repartition_ventilation?: number;
}

export interface VentilationDI {
  pvent_moy?: number;
  q4pa_conv: number;
  conso_auxiliaire_ventilation: number;
  hperm: number;
  hvent: number;
}
