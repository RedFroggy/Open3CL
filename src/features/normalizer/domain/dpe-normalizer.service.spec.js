import { jest } from '@jest/globals';
import { Log } from '../../../core/util/logger/log-service.js';

/**
 * @type {Dpe}
 * */
import dpe from '../../../../test/freezed-dpe.json';
import { DpeNormalizerService } from './dpe-normalizer.service.js';

describe('Normalisation des DPE', () => {
  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
  });

  test('Normalisation des épaisseurs de mur', () => {
    dpe.logement.enveloppe.mur_collection.mur.forEach((m) => {
      expect(m.donnee_entree.epaisseur_structure).toBeUndefined();
    });

    const nDpe = DpeNormalizerService.normalize(dpe);

    nDpe.logement.enveloppe.mur_collection.mur.forEach((m) => {
      expect(m.donnee_entree.epaisseur_structure).not.toBeUndefined();
    });
  });
});
