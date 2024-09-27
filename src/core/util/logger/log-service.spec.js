import { jest } from '@jest/globals';
import { Log } from './log-service.js';

describe('Log service unit tests', () => {
  let errorSpy = jest.spyOn(console, 'error');
  let debugSpy = jest.spyOn(console, 'debug');
  let warnSpy = jest.spyOn(console, 'warn');
  let infoSpy = jest.spyOn(console, 'info');

  beforeEach(() => {
    debugSpy.mockReset();
    infoSpy.mockReset();
    warnSpy.mockReset();
    errorSpy.mockReset();
    process.env.LOG_LEVEL = null;
  });

  it('should write debug on console', () => {
    Log.debug('A debug message', { prop: 'value' });
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] A debug message', {
      prop: 'value'
    });

    Log.log('A log message', { prop: 'value' });
    expect(debugSpy).toHaveBeenCalledWith('[DEBUG] A log message', {
      prop: 'value'
    });
  });

  it('should write info on console', () => {
    Log.info('An info message', { prop: 'value' });
    expect(infoSpy).toHaveBeenCalledWith('[INFO] An info message', {
      prop: 'value'
    });
  });

  it('should write warn on console', () => {
    Log.warn('A warn message', { prop: 'value' });
    expect(warnSpy).toHaveBeenCalledWith('[WARN] A warn message', {
      prop: 'value'
    });
  });

  it('should write error on console', () => {
    Log.error('An error message', { prop: 'value' });
    expect(errorSpy).toHaveBeenCalledWith('[ERROR] An error message', {
      prop: 'value'
    });
  });

  it('should write on console with correct log level', () => {
    process.env.LOG_LEVEL = 'info';

    Log.debug('A message');
    expect(debugSpy).not.toHaveBeenCalled();

    Log.error('A message');
    expect(errorSpy).toHaveBeenCalled();

    Log.info('A message');
    expect(infoSpy).toHaveBeenCalled();
  });
});
