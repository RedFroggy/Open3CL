import { jest } from '@jest/globals';
import { Log } from '../../../core/util/logger/log-service.js';
import corpus from '../../../../test/corpus.json';
import { getAdemeFileJson } from '../../../../test/test-helpers.js';
import { ContexteBuilder } from './contexte.builder.js';
import { DpeNormalizerService } from '../../normalizer/domain/dpe-normalizer.service.js';
import { DeperditionPlancherBasService } from './deperdition-plancher-bas.service.js';

describe('Calcul de déperdition des planchers bas', () => {
  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
  });

  describe('Determination de upb, upb0 et upb_final', () => {
    test('Plancher  1 - Dalle béton non isolée donnant sur un terre-plein', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '5',
        enum_type_plancher_bas_id: '9',
        enum_methode_saisie_u0_id: '2',
        enum_type_isolation_id: '2',
        enum_methode_saisie_u_id: '1',
        calcul_ue: 1,
        perimetre_ue: 19.2,
        ue: 0.49684211
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(2);
      expect(di.upb0).toBeCloseTo(2);
      expect(di.upb_final).toBeCloseTo(0.49684211);
    });

    test('Plancher  1 - Plancher lourd type entrevous terre-cuite, poutrelles béton donnant sur un sous-sol non chauffé avec isolation intrinsèque ou en sous-face (5 cm)', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '6',
        enum_type_plancher_bas_id: '11',
        enum_methode_saisie_u0_id: '2',
        enum_type_isolation_id: '4',
        epaisseur_isolation: 5,
        enum_methode_saisie_u_id: '3',
        calcul_ue: 0,
        perimetre_ue: 27,
        surface_ue: 42.08,
        ue: 0.37117494
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(0.59154929577464788);
      expect(di.upb0).toBeCloseTo(2);
      expect(di.upb_final).toBeCloseTo(0.37117494);
    });

    test('Plancher  2 - Plancher avec ou sans remplissage non isolé donnant sur un garage', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '21',
        enum_type_plancher_bas_id: '2',
        enum_methode_saisie_u0_id: '2',
        enum_type_isolation_id: '2',
        enum_methode_saisie_u_id: '1',
        calcul_ue: 0
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(1.45);
      expect(di.upb0).toBeCloseTo(1.45);
      expect(di.upb_final).toBeCloseTo(1.45);
    });

    test('Test de plancher avec upb0 saisie', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '21',
        enum_type_plancher_bas_id: '2',
        enum_methode_saisie_u0_id: '9',
        enum_type_isolation_id: '2',
        enum_methode_saisie_u_id: '1',
        calcul_ue: 0,
        upb0_saisi: 3.2
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(2);
      expect(di.upb0).toBeCloseTo(3.2);
      expect(di.upb_final).toBeCloseTo(2);
    });

    test('Test de plancher avec type de paroi inconnue', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '21',
        enum_type_plancher_bas_id: '1',
        enum_methode_saisie_u0_id: '1',
        enum_type_isolation_id: '2',
        enum_methode_saisie_u_id: '1',
        calcul_ue: 0
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(2);
      expect(di.upb0).toBeCloseTo(2);
      expect(di.upb_final).toBeCloseTo(2);
    });

    test('Test de plancher avec upb directement saisie', () => {
      /** @type {Contexte} */
      const ctx = {
        effetJoule: false,
        enumPeriodeConstructionId: '6',
        zoneClimatiqueId: '3'
      };
      /** @type {PlancherBasDE} */
      const de = {
        enum_type_adjacence_id: '21',
        enum_type_plancher_bas_id: '1',
        enum_methode_saisie_u0_id: '5',
        enum_type_isolation_id: '2',
        enum_methode_saisie_u_id: '9',
        calcul_ue: 0,
        upb_saisi: 1.25
      };

      const di = DeperditionPlancherBasService.process(ctx, de);
      expect(di.upb).toBeCloseTo(1.25);
      expect(di.upb0).toBeUndefined();
      expect(di.upb_final).toBeCloseTo(1.25);
    });
  });

  describe("Test d'intégration de plancher bas", () => {
    test.each(corpus)('vérification des DI des pb pour dpe %s', (ademeId) => {
      /**
       * @type {Dpe}
       */
      let dpeRequest = getAdemeFileJson(ademeId);
      dpeRequest = DpeNormalizerService.normalize(dpeRequest);

      /** @type {Contexte} */
      const ctx = ContexteBuilder.fromDpe(dpeRequest);

      /** @type {PlancherBas[]} */
      const pbs = dpeRequest.logement.enveloppe.plancher_bas_collection?.plancher_bas || [];

      pbs.forEach((pb) => {
        const di = DeperditionPlancherBasService.process(ctx, pb.donnee_entree);

        if (pb.donnee_intermediaire) {
          expect(di.upb0).toBeCloseTo(pb.donnee_intermediaire.upb0, 2);
        } else {
          expect(di.upb0).toBeUndefined();
        }
        expect(di.upb).toBeCloseTo(pb.donnee_intermediaire.upb, 2);
        expect(di.upb_final).toBeCloseTo(pb.donnee_intermediaire.upb_final, 2);
        expect(di.b).toBeCloseTo(pb.donnee_intermediaire.b, 2);
      });
    });
  });
});
