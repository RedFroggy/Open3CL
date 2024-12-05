import { jest } from '@jest/globals';
import { Log } from '../../../core/util/logger/log-service.js';
import corpus from '../../../../test/corpus-sano.json';
import { getAdemeFileJson } from '../../../../test/test-helpers.js';
import { ContexteBuilder } from './contexte.builder.js';
import { DpeNormalizerService } from '../../normalizer/domain/dpe-normalizer.service.js';
import { DeperditionBaieVitreeService } from './deperdition-baie-vitree.service.js';

describe('Calcul de déperdition des baies vitrées', () => {
  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
  });

  describe('Determination des données intermédiaires', () => {
    test.each([
      /**
       *           <donnee_entree>
       *             <description>Fenêtre  1 Nord - Fenêtres battantes bois, orientées Nord, simple vitrage avec volets battants bois</description>
       *             <enum_type_adjacence_id>1</enum_type_adjacence_id>
       *             <surface_totale_baie>3.2</surface_totale_baie>
       *             <nb_baie>1</nb_baie>
       *             <tv_ug_id>1</tv_ug_id>
       *             <enum_type_vitrage_id>1</enum_type_vitrage_id>
       *             <enum_inclinaison_vitrage_id>3</enum_inclinaison_vitrage_id>
       *             <enum_methode_saisie_perf_vitrage_id>1</enum_methode_saisie_perf_vitrage_id>
       *             <tv_uw_id>562</tv_uw_id>
       *             <enum_type_materiaux_menuiserie_id>3</enum_type_materiaux_menuiserie_id>
       *             <enum_type_baie_id>4</enum_type_baie_id>
       *             <double_fenetre>0</double_fenetre>
       *             <uw_1>5.4</uw_1>
       *             <sw_1>0.52</sw_1>
       *             <tv_deltar_id>6</tv_deltar_id>
       *             <tv_ujn_id>225</tv_ujn_id>
       *             <enum_type_fermeture_id>7</enum_type_fermeture_id>
       *             <presence_retour_isolation>0</presence_retour_isolation>
       *             <largeur_dormant>5</largeur_dormant>
       *             <tv_sw_id>89</tv_sw_id>
       *             <enum_type_pose_id>3</enum_type_pose_id>
       *             <enum_orientation_id>2</enum_orientation_id>
       *             <tv_coef_masque_proche_id>19</tv_coef_masque_proche_id>
       *             <masque_lointain_non_homogene_collection xsi:nil="true"></masque_lointain_non_homogene_collection>
       *           </donnee_entree>
       *           <donnee_intermediaire>
       *             <b>1</b>
       *             <ug>5.8</ug>
       *             <uw>5.4</uw>
       *             <ujn>3.8</ujn>
       *             <u_menuiserie>3.8</u_menuiserie>
       *             <sw>0.52</sw>
       *             <fe1>1</fe1>
       *             <fe2>1</fe2>
       *           </donnee_intermediaire>
       */
      {
        label:
          'Fenêtre  1 Nord - Fenêtres battantes bois, orientées Nord, simple vitrage avec volets battants bois',
        enumTypeVitrageId: '9',
        epaisseurLame: '0',
        couchePeuEmissive: '0',
        enumTypeGazLameId: '0',
        enumInclinaisonVitrageId: '0',
        enumTypeMateriauxMenuiserieId: '0',
        enumTypeFermetureId: '0',
        ugExpected: 0,
        uwExpected: 0,
        ujnExpected: 0,
        uMenuiserieExpected: 0,
        swExpected: 0,
        fe1Expected: 0,
        fe2Expected: 0
      },

      /**
       * <baie_vitree>
       *           <donnee_entree>
       *             <description>Porte-fenêtre Est - Portes-fenêtres battantes avec soubassement bois, orientées Est, en survitrage avec lame d&apos;air 6 mm et persiennes avec ajours fixes</description>
       *             <reference>2023_05_26_10_05_22_2115101008588418</reference>
       *             <reference_paroi>2023_05_26_10_00_11_70464740006399357</reference_paroi>
       *             <reference_lnc xsi:nil="true"></reference_lnc>
       *             <tv_coef_reduction_deperdition_id>1</tv_coef_reduction_deperdition_id>
       *             <enum_type_adjacence_id>1</enum_type_adjacence_id>
       *             <surface_totale_baie>5.04</surface_totale_baie>
       *             <nb_baie>1</nb_baie>
       *             <tv_ug_id>74</tv_ug_id>
       *             <enum_type_vitrage_id>4</enum_type_vitrage_id>
       *             <enum_inclinaison_vitrage_id>3</enum_inclinaison_vitrage_id>
       *             <enum_type_gaz_lame_id>1</enum_type_gaz_lame_id>
       *             <epaisseur_lame>6</epaisseur_lame>
       *             <vitrage_vir>0</vitrage_vir>
       *             <enum_methode_saisie_perf_vitrage_id>1</enum_methode_saisie_perf_vitrage_id>
       *             <tv_uw_id>714</tv_uw_id>
       *             <enum_type_materiaux_menuiserie_id>3</enum_type_materiaux_menuiserie_id>
       *             <enum_type_baie_id>8</enum_type_baie_id>
       *             <double_fenetre>0</double_fenetre>
       *             <uw_1>3.1</uw_1>
       *             <sw_1>0.43</sw_1>
       *             <tv_deltar_id>1</tv_deltar_id>
       *             <tv_ujn_id>25</tv_ujn_id>
       *             <enum_type_fermeture_id>2</enum_type_fermeture_id>
       *             <presence_protection_solaire_hors_fermeture>0</presence_protection_solaire_hors_fermeture>
       *             <presence_retour_isolation>0</presence_retour_isolation>
       *             <presence_joint>0</presence_joint>
       *             <largeur_dormant>5</largeur_dormant>
       *             <tv_sw_id>105</tv_sw_id>
       *             <enum_type_pose_id>2</enum_type_pose_id>
       *             <enum_orientation_id>3</enum_orientation_id>
       *             <tv_coef_masque_proche_id>19</tv_coef_masque_proche_id>
       *             <masque_lointain_non_homogene_collection xsi:nil="true"></masque_lointain_non_homogene_collection></donnee_entree>
       *           <donnee_intermediaire>
       *             <b>1</b>
       *             <ug>3.4</ug>
       *             <uw>3.1</uw>
       *             <ujn>2.8</ujn>
       *             <u_menuiserie>2.8</u_menuiserie>
       *             <sw>0.43</sw>
       *             <fe1>1</fe1>
       *             <fe2>1</fe2>
       *           </donnee_intermediaire>
       */
      {
        label:
          'Porte-fenêtre Est - Portes-fenêtres battantes avec soubassement bois, orientées Est, en survitrage avec lame d&apos;air 6 mm et persiennes avec ajours fixes',
        enumTypeVitrageId: '4',
        epaisseurLame: '6',
        ugExpected: 3.4,
        uwExpected: 3.1,
        ujnExpected: 2.8,
        uMenuiserieExpected: 2.8,
        swExpected: 0.43,
        fe1Expected: 1,
        fe2Expected: 1
      }
    ])(
      '$label',
      ({
        enumTypeVitrageId,
        epaisseurLame,
        couchePeuEmissive,
        enumTypeGazLameId,
        enumInclinaisonVitrageId,
        enumTypeMateriauxMenuiserieId,
        enumTypeFermetureId,
        enumPeriodeConstructionId = 1,
        effetJoule = false,
        zoneClimatiqueId = '1',
        bExpected = 1,
        ugExpected = undefined,
        uwExpected = undefined,
        ujnExpected = undefined,
        uMenuiserieExpected = undefined,
        swExpected = undefined,
        fe1Expected = undefined,
        fe2Expected = undefined
      }) => {
        /** @type {Contexte} */
        const ctx = {
          effetJoule,
          enumPeriodeConstructionId,
          zoneClimatiqueId
        };

        /** @type {BaieVitreeDE} */
        const de = {
          enum_type_vitrage_id: enumTypeVitrageId,
          epaisseur_lame: epaisseurLame,
          presence_protection_solaire_hors_fermeture: undefined,
          enum_type_gaz_lame_id: enumTypeGazLameId,
          enum_inclinaison_vitrage_id: enumInclinaisonVitrageId,
          enum_type_materiaux_menuiserie_id: enumTypeMateriauxMenuiserieId,
          enum_type_fermeture_id: enumTypeFermetureId,
          enum_type_adjacence_id: '1',
          vitrage_vir: couchePeuEmissive
        };

        const di = DeperditionBaieVitreeService.process(ctx, de);

        expect(di.b).toBeCloseTo(bExpected, 2);
        expect(di.ug).toBeCloseTo(ugExpected, 2);
        /*expect(di.uw).toBeCloseTo(uwExpected, 2);
        expect(di.ujn).toBeCloseTo(ujnExpected, 2);
        expect(di.u_menuiserie).toBeCloseTo(uMenuiserieExpected, 2);
        expect(di.sw).toBeCloseTo(swExpected, 2);
        expect(di.fe1).toBeCloseTo(fe1Expected, 2);
        expect(di.fe2).toBeCloseTo(fe2Expected, 2);*/
      }
    );
  });

  describe("Test d'intégration des baies vitrées", () => {
    test.each(corpus)('vérification des DI des baies vitrées pour dpe %s', (ademeId) => {
      let dpeRequest = getAdemeFileJson(ademeId);
      dpeRequest = DpeNormalizerService.normalize(dpeRequest);

      /** @type {Contexte} */
      const ctx = ContexteBuilder.fromDpe(dpeRequest);

      const bvs = dpeRequest.logement.enveloppe.baie_vitree_collection?.baie_vitree || [];

      bvs.forEach((bv) => {
        const di = DeperditionBaieVitreeService.process(ctx, bv.donnee_entree);

        expect(di.b).toBeCloseTo(bv.donnee_intermediaire.b, 2);
        expect(di.ug).toBeCloseTo(bv.donnee_intermediaire.ug, 2);
        expect(di.uw).toBeCloseTo(bv.donnee_intermediaire.uw, 2);
        expect(di.ujn).toBeCloseTo(bv.donnee_intermediaire.ujn, 2);
        expect(di.u_menuiserie).toBeCloseTo(bv.donnee_intermediaire.u_menuiserie, 2);
        expect(di.sw).toBeCloseTo(bv.donnee_intermediaire.sw, 2);
        expect(di.fe1).toBeCloseTo(bv.donnee_intermediaire.fe1, 2);
        expect(di.fe2).toBeCloseTo(bv.donnee_intermediaire.fe2, 2);
      });
    });
  });
});
