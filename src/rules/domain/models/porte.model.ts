export interface Porte {
  donneeEntree?: PorteDE;
  donneeIntermediaire?: PorteDI;
}

export interface PorteDE {
  description?: string;
  reference?: string;
  referenceParoi?: string;
  referenceLnc?: string;
  enumCfgIsolationLncId?: string; // ENUM cfg_isolation_lnc
  enumTypeAdjacenceId?: string; // ENUM type_adjacence
  tvCoefReductionDeperditionId?: string; // TV
  surfaceAiu?: number;
  surfaceAue?: number;
  surfacePorte?: number;
  tvUporteId?: string; // TV
  enumMethodeSaisieUporteId?: string; // ENUM methode_saisie_uporte
  enumTypePorteId?: string; // ENUM type_porte
  uporteSaisi?: number;
  nbPorte?: string;
  largeurDormant?: string;
  presenceRetourIsolation?: string;
  presenceJoint?: boolean;
  enumTypePoseId?: string; // ENUM type_pose
}

export interface PorteDI {
  uporte: number;
  b: number;
}
