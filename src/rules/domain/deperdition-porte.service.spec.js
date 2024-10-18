import { DeperditionPorteService } from './deperdition-porte.service.js';
import { jest } from '@jest/globals';
import { Log } from '../../core/util/logger/log-service.js';
import { DeperditionService } from './deperdition.service.js';

describe('Calcul de déperdition des portes', () => {
  /** @type {Contexte} */
  const ctx = { zoneClimatiqueId: '1' };

  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
    DeperditionService.b = () => 1;
  });

  describe('Determination de uPorte', () => {
    test.each([
      { type: '1', label: 'porte simple en bois porte opaque pleine', uPorteExpected: 3.5 },
      {
        type: '2',
        label: 'porte simple en bois porte avec moins de 30% de vitrage simple',
        uPorteExpected: 4
      },
      {
        type: '3',
        label: 'porte simple en bois porte avec 30-60% de vitrage simple',
        uPorteExpected: 4.5
      },
      { type: '4', label: 'porte simple en bois porte avec double vitrage', uPorteExpected: 3.3 },
      { type: '5', label: 'porte simple en pvc porte opaque pleine', uPorteExpected: 3.5 },
      {
        type: '6',
        label: 'porte simple en pvc porte avec moins de 30% de vitrage simple',
        uPorteExpected: 4
      },
      {
        type: '7',
        label: 'porte simple en pvc porte avec 30-60% de vitrage simple',
        uPorteExpected: 4.5
      },
      { type: '8', label: 'porte simple en pvc porte avec double vitrage', uPorteExpected: 3.3 },

      { type: '9', label: 'porte simple en métal porte opaque pleine', uPorteExpected: 5.8 },
      { type: '10', label: 'porte simple en métal porte avec vitrage simple', uPorteExpected: 5.8 },
      {
        type: '11',
        label: 'porte simple en métal porte avec moins de 30% de double vitrage',
        uPorteExpected: 5.5
      },
      {
        type: '12',
        label: 'porte simple en métal porte avec 30-60% de double vitrage',
        uPorteExpected: 4.8
      },

      { type: '13', label: 'toute menuiserie porte opaque pleine isolée', uPorteExpected: 1.5 },
      { type: '14', label: 'toute menuiserie porte précédée d’un sas', uPorteExpected: 1.5 },
      {
        type: '15',
        label: 'toute menuiserie porte isolée avec double vitrage',
        uPorteExpected: 1.5
      },

      { type: '16', label: 'autre type de porte', uPorteExpected: undefined }
    ])('$label (id:$type)', ({ type, uPorteExpected }) => {
      /** @type {PorteDE} */
      const de = {
        enumTypePorteId: type
      };

      const di = DeperditionPorteService.process(ctx, de);
      expect(di.uporte).toBe(uPorteExpected);
      expect(di.b).toBe(1);
    });

    test('autre porte Uporte saisie manuellement ', () => {
      /** @type {PorteDE} */
      const de = {
        enumTypePorteId: '16',
        enumMethodeSaisieUporteId: '2',
        uporteSaisi: 1.6
      };

      const di = DeperditionPorteService.process(ctx, de);
      expect(di.uporte).toBe(de.uporteSaisi);
      expect(di.b).toBe(1);
    });

    test('autre porte Uporte saisie manuellement et justifié', () => {
      /** @type {PorteDE} */
      const de = {
        enumTypePorteId: '16',
        enumMethodeSaisieUporteId: '3',
        uporteSaisi: 1.88
      };

      const di = DeperditionPorteService.process(ctx, de);
      expect(di.uporte).toBe(de.uporteSaisi);
      expect(di.b).toBe(1);
    });
  });
});
