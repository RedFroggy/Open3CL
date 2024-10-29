import { jest } from '@jest/globals';
import { Log } from '../../../core/util/logger/log-service.js';
import { getAdemeFileJson, removeDIAndResult } from '../../../../test/test-helpers.js';
import { EngineService } from './engine.service.js';

describe('Application de la méthode 3CL', () => {
  beforeAll(() => {
    Log.debug = jest.fn();
    Log.warn = jest.fn();
    Log.error = jest.fn();
    Log.info = jest.fn();
  });

  xtest('sur un DPE classique : DPE_TEST_001', () => {
    /** @type {Dpe} */
    const originalDpe = getAdemeFileJson('DPE_TEST_001');

    removeDIAndResult(originalDpe);

    const dpe = EngineService.process(originalDpe);
  });
});
