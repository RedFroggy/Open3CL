import calc_mur from './3.2.1_mur.js';

describe('Recherche de bugs dans le calcul de déperdition des murs', () => {
  /**
   * @see : https://redfroggy.atlassian.net/browse/KAR-119
   */
  it('calcul de déperdition pour les murs de 2213E0696993Z', () => {
    const zc = 8; // H3
    const pc_id = 2; // Période de construction (1948)
    const ej = 0;
    const mur = {
      donnee_entree: {
        description:
          "Mur  2 Est - Inconnu donnant sur des circulations sans ouverture directe sur l'extérieur",
        reference: '2021_08_24_18_02_58_7233440008111783',
        tv_coef_reduction_deperdition_id: 78,
        surface_aiu: 22,
        surface_aue: 15,
        enum_cfg_isolation_lnc_id: '2',
        enum_type_adjacence_id: '14', // Circulation sans ouverture directe sur l'extérieur
        enum_orientation_id: '3', // Est
        surface_paroi_totale: 10.5,
        surface_paroi_opaque: 10.5,
        tv_umur0_id: 1,
        enum_materiaux_structure_mur_id: '1', // Inconnu
        enum_methode_saisie_u0_id: '2', // déterminé selon le matériau et épaisseur à partir de la table de valeur forfaitaire
        paroi_ancienne: 0,
        enum_type_doublage_id: '2', // absence de doublage
        enum_type_isolation_id: '1', // inconnu
        enum_periode_isolation_id: '2', // 1948-1974
        tv_umur_id: 6, //
        enum_methode_saisie_u_id: '8' // année de construction saisie (table forfaitaire)
      },
      donnee_intermediaire: {
        b: 0.35,
        umur: 2.5,
        umur0: 2.5
      }
    };
    calc_mur(mur, zc, pc_id, ej);

    expect(mur.donnee_intermediaire.b).toBe(0.35);
    expect(mur.donnee_intermediaire.umur).toBe(2.5);
    expect(mur.donnee_intermediaire.umur0).toBe(2.5);
  });

  /**
   * @see : https://redfroggy.atlassian.net/browse/KAR-118
   */
  xit('calcul de déperdition pour les murs de 2187E0982013C', () => {
    const zc1 = 3; // zone climatique H1c
    const pc_id1 = 1; // Période de construction (1947)
    const ej1 = 1; // Type de chauffage
    const mur1 = {
      donnee_entree: {
        description:
          "Mur Nord, Sud, Est, Ouest - Mur en pierre de taille et moellons avec remplissage tout venant d'épaisseur 50 cm non isolé donnant sur l'extérieur",
        enum_type_adjacence_id: '1', // Extérieur
        enum_orientation_id: '4', // Sud Ouest
        surface_paroi_totale: 134.76,
        surface_paroi_opaque: 134.76,
        tv_umur0_id: 15,
        enum_materiaux_structure_mur_id: '3', // Mur en pierre de taille et moellons avec remplissage tout venant
        enum_methode_saisie_u0_id: '2', // déterminé selon le matériau et épaisseur à partir de la table de valeur forfaitaire
        paroi_ancienne: 1,
        enum_type_doublage_id: '2', // absence de doublage
        enum_type_isolation_id: '2', // Non isolé
        enum_methode_saisie_u_id: '1', // Non isolé
        reference: 'mur_0'
      },
      donnee_intermediaire: {
        b: 1,
        umur: 0.81545, // uMur-tab 1947 sur zc H1 = 2.5
        umur0: 0.81545
      }
    };
    calc_mur(mur1, zc1, pc_id1, ej1);

    expect(mur1.donnee_intermediaire.b).toBe(1);
    expect(mur1.donnee_intermediaire.umur).toBe(1.9);
    expect(mur1.donnee_intermediaire.umur0).toBe(1.9);
  });

  /**
   * @see : https://redfroggy.atlassian.net/browse/KAR-123
   */
  it('calcul de déperdition pour les murs de 2287E1327399F', () => {
    const zc = 3;
    const pc_id = 1;
    const ej = 1;
    const mur = {
      donnee_entree: {
        description:
          "Mur  1 Nord - Mur en pierre de taille et moellons avec remplissage tout venant d'épaisseur 60 cm avec isolation intérieure (R=3,7m².K/W) donnant sur un bâtiment ou local à usage autre que d'habitation",
        reference: '2022_06_15_14_48_45_6578917004465132',
        tv_coef_reduction_deperdition_id: 4,
        enum_type_adjacence_id: '4',
        enum_orientation_id: '2',
        surface_paroi_totale: 48.39,
        surface_paroi_opaque: 48.39,
        tv_umur0_id: 17,
        epaisseur_structure: 60,
        enum_materiaux_structure_mur_id: '3',
        enum_methode_saisie_u0_id: '2',
        paroi_ancienne: 1,
        enum_type_doublage_id: '2',
        enum_type_isolation_id: '3',
        resistance_isolation: 3.7,
        enum_methode_saisie_u_id: '6'
      },
      donnee_intermediaire: { b: 0.2, umur: 0.19900518501955455, umur0: 0.7547200000000001 }
    };
    calc_mur(mur, zc, pc_id, ej);

    // Est-ce que ces valeurs sont correctes ? le umurO en particulier ne correspond à rien (d'apr-s la doc c'est 1.6)
    expect(mur.donnee_intermediaire.b).toBe(0.2);
    expect(mur.donnee_intermediaire.umur0).toBeCloseTo(0.7547200000000001);
    expect(mur.donnee_intermediaire.umur).toBeCloseTo(0.19900518501955455);
  });
});
