import { jest } from '@jest/globals';
import { Log } from '../../core/util/logger/log-service.js';
import { TvStore } from './tv.store.js';
import { tv } from '../../utils.js';

describe('Lecture des tables de valeurs', () => {
  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
  });

  describe('lecture des valeurs de b', () => {
    test.each([
      { enumTypeAdjacenceId: '1', label: 'extérieur', bExpected: 1 },
      { enumTypeAdjacenceId: '2', label: 'paroi enterrée', bExpected: 1 },
      { enumTypeAdjacenceId: '3', label: 'vide sanitaire', bExpected: 1 },
      {
        enumTypeAdjacenceId: '4',
        label: "bâtiment ou local à usage autre que d'habitation",
        bExpected: 0.2
      },
      { enumTypeAdjacenceId: '5', label: 'terre-plein', bExpected: 1 },
      { enumTypeAdjacenceId: '6', label: 'sous-sol non chauffé', bExpected: 1 },
      {
        enumTypeAdjacenceId: '7',
        enumCfgIsolationLncId: '1',
        uVue: 3,
        label: 'locaux non chauffés non accessible',
        bExpected: 0.95
      },
      {
        enumTypeAdjacenceId: '22',
        label: "local non déperditif (local à usage d'habitation chauffé)",
        bExpected: 0
      },
      {
        enumTypeAdjacenceId: '8',
        uVue: 3,
        enumCfgIsolationLncId: '2',
        rAiuAue: 0.1,
        label: 'garage',
        bExpected: 0.9
      }
    ])(
      'b pour $label (id:$enumTypeAdjacenceId)',
      ({
        enumTypeAdjacenceId,
        uVue = undefined,
        enumCfgIsolationLncId = undefined,
        rAiuAue = undefined,
        bExpected
      }) => {
        const b = TvStore.getB(enumTypeAdjacenceId, uVue, enumCfgIsolationLncId, rAiuAue);
        expect(b).toBe(bExpected);
      }
    );
  });

  describe('lecture des valeurs de uVue', () => {
    test.each([
      { enumTypeAdjacenceId: '1', label: 'extérieur', expected: undefined },
      { enumTypeAdjacenceId: '2', label: 'paroi enterrée', expected: undefined },
      { enumTypeAdjacenceId: '3', label: 'vide sanitaire', expected: undefined },
      {
        enumTypeAdjacenceId: '4',
        label: "bâtiment ou local à usage autre que d'habitation",
        expected: undefined
      },
      { enumTypeAdjacenceId: '5', label: 'terre-plein', expected: undefined },
      { enumTypeAdjacenceId: '6', label: 'sous-sol non chauffé', expected: undefined },
      {
        enumTypeAdjacenceId: '7',
        label: 'locaux non chauffés non accessible',
        expected: undefined
      },
      { enumTypeAdjacenceId: '8', label: 'garage', expected: 3 },
      { enumTypeAdjacenceId: '9', label: 'cellier', expected: 3 },
      {
        enumTypeAdjacenceId: '10',
        label: 'espace tampon solarisé (véranda,loggia fermée)',
        expected: undefined
      },
      { enumTypeAdjacenceId: '11', label: 'comble fortement ventilé', expected: 9 },
      { enumTypeAdjacenceId: '12', label: 'comble faiblement ventilé', expected: 3 },
      { enumTypeAdjacenceId: '13', label: 'comble très faiblement ventilé', expected: 0.3 },
      {
        enumTypeAdjacenceId: '14',
        label: "circulation sans ouverture directe sur l'extérieur",
        expected: 0
      },
      {
        enumTypeAdjacenceId: '15',
        label: "circulation avec ouverture directe sur l'extérieur",
        expected: 0.3
      },
      {
        enumTypeAdjacenceId: '16',
        label: 'circulation avec bouche ou gaine de désenfumage ouverte en permanence',
        expected: 3
      },
      {
        enumTypeAdjacenceId: '17',
        label: "hall d'entrée avec dispositif de fermeture automatique",
        expected: 0.3
      },
      {
        enumTypeAdjacenceId: '18',
        label: "hall d'entrée sans dispositif de fermeture automatique",
        expected: 3
      },
      { enumTypeAdjacenceId: '19', label: 'garage privé collectif', expected: 3 },
      {
        enumTypeAdjacenceId: '20',
        label: "local tertiaire à l'intérieur de l'immeuble en contact avec l'appartement",
        expected: undefined
      },
      { enumTypeAdjacenceId: '21', label: 'autres dépendances', expected: 3 },
      {
        enumTypeAdjacenceId: '22',
        label: "local non déperditif (local à usage d'habitation chauffé)",
        expected: undefined
      }
    ])('uVue pour $label (id:$enumTypeAdjacenceId)', ({ enumTypeAdjacenceId, expected }) => {
      const uVue = TvStore.getUVue(enumTypeAdjacenceId);
      expect(uVue).toBe(expected);
    });
  });

  describe('lecture des valeurs de umur0', () => {
    test.each([
      { label: 'mur inconnu', enumMateriauxStructureMurId: '1', expected: 2.5 },
      {
        label: "Murs en pierre de taille et moellons constitué d'un seul matériaux 18cm",
        enumMateriauxStructureMurId: '2',
        epaisseurStructure: 18,
        expected: 3.2
      },
      {
        label: "Murs en pierre de taille et moellons constitué d'un seul matériaux 37cm",
        enumMateriauxStructureMurId: '2',
        epaisseurStructure: 37,
        expected: 2.45
      },
      {
        label: "Murs en pierre de taille et moellons constitué d'un seul matériaux 30cm",
        enumMateriauxStructureMurId: '2',
        epaisseurStructure: 30,
        expected: 2.65
      },
      {
        label: "Murs en pierre de taille et moellons constitué d'un seul matériaux 39cm",
        enumMateriauxStructureMurId: '2',
        epaisseurStructure: 39,
        expected: 2.45
      },
      {
        label: "Murs en pierre de taille et moellons constitué d'un seul matériaux 98cm",
        enumMateriauxStructureMurId: '2',
        epaisseurStructure: 98,
        expected: 1.5
      },
      {
        label: 'Murs en pan de bois sans remplissage tout venant',
        enumMateriauxStructureMurId: '5',
        epaisseurStructure: 12,
        expected: 2.7
      }
    ])(
      'umur pour $label (id:$enumMateriauxStructureMurId)',
      ({ enumMateriauxStructureMurId, epaisseurStructure, expected }) => {
        const umur0 = TvStore.getUmur0(enumMateriauxStructureMurId, epaisseurStructure);
        expect(umur0).toBe(expected);
      }
    );
  });

  /**
   *
   *   periode_construction: {
   *     1: 'avant 1948',
   *     2: '1948-1974',
   *     3: '1975-1977',
   *     4: '1978-1982',
   *     5: '1983-1988',
   *     6: '1989-2000',
   *     7: '2001-2005',
   *     8: '2006-2012',
   *     9: '2013-2021',
   *     10: 'après 2021'
   *   },
   * @type {*|string}
   */
  /**
   *
   *   zone_climatique: {
   *     1: 'h1a',
   *     2: 'h1b',
   *     3: 'h1c',
   *     4: 'h2a',
   *     5: 'h2b',
   *     6: 'h2c',
   *     7: 'h2d',
   *     8: 'h3'
   *   },
   */

  describe('lecture des valeurs de umur', () => {
    test.each([
      {
        label: 'mur année de construction avant 1948 zone climatique h1a',
        enumPeriodeConstructionId: '1',
        enumZoneClimatiqueId: '1',
        expected: 2.5
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h1a',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '1',
        expected: 0.8
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h2a',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '4',
        expected: 0.84
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h3',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '8',
        effetJoule: false,
        expected: 0.89
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h1a',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '1',
        effetJoule: true,
        expected: 0.7
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h2a',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '4',
        effetJoule: true,
        expected: 0.74
      },
      {
        label: 'mur année de construction 1983-1988 zone climatique h3',
        enumPeriodeConstructionId: '5',
        enumZoneClimatiqueId: '8',
        effetJoule: true,
        expected: 0.78
      }
    ])(
      'umur pour $label',
      ({ enumPeriodeConstructionId, enumZoneClimatiqueId, effetJoule, expected }) => {
        const umur = TvStore.getUmur(enumPeriodeConstructionId, enumZoneClimatiqueId, effetJoule);
        expect(umur).toBe(expected);
      }
    );
  });

  describe('Benchmark b', () => {
    test('reworked', () => {
      for (let i = 0; i < 1000; i++) {
        const b = TvStore.getB('8');
        expect(b).toBe(1);
      }
    });

    test('legacy', () => {
      const matcher = {
        enum_type_adjacence_id: '8'
      };

      for (let i = 0; i < 1000; i++) {
        const result = tv('coef_reduction_deperdition', matcher);
        expect(result.b).toBe('1');
      }
    });
  });

  describe('Benchmark uVue', () => {
    test('reworked', () => {
      for (let i = 0; i < 1000; i++) {
        const uVue = TvStore.getUVue('8');
        expect(uVue).toBe(3);
      }
    });

    test('legacy', () => {
      const matcher = {
        enum_type_adjacence_id: '8'
      };

      for (let i = 0; i < 1000; i++) {
        const result = tv('uvue', matcher);
        expect(result.uvue).toBe('3');
      }
    });
  });
});
