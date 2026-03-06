import { CoviaError, RunStatus } from '../types';

describe('CoviaError', () => {
  it('is an instance of Error', () => {
    const err = new CoviaError('test');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(CoviaError);
  });

  it('sets name to CoviaError', () => {
    const err = new CoviaError('test');
    expect(err.name).toBe('CoviaError');
  });

  it('sets message', () => {
    const err = new CoviaError('something went wrong');
    expect(err.message).toBe('something went wrong');
  });

  it('defaults code to null', () => {
    const err = new CoviaError('test');
    expect(err.code).toBeNull();
  });

  it('accepts a custom code', () => {
    const err = new CoviaError('not found', 404);
    expect(err.code).toBe(404);
    expect(err.message).toBe('not found');
  });

  it('has a stack trace', () => {
    const err = new CoviaError('test');
    expect(err.stack).toBeDefined();
  });
});

describe('RunStatus', () => {
  it('has all expected values', () => {
    expect(RunStatus.COMPLETE).toBe('COMPLETE');
    expect(RunStatus.FAILED).toBe('FAILED');
    expect(RunStatus.PENDING).toBe('PENDING');
    expect(RunStatus.STARTED).toBe('STARTED');
    expect(RunStatus.CANCELLED).toBe('CANCELLED');
    expect(RunStatus.TIMEOUT).toBe('TIMEOUT');
    expect(RunStatus.REJECTED).toBe('REJECTED');
    expect(RunStatus.INPUT_REQUIRED).toBe('INPUT_REQUIRED');
    expect(RunStatus.AUTH_REQUIRED).toBe('AUTH_REQUIRED');
    expect(RunStatus.PAUSED).toBe('PAUSED');
  });

  it('has exactly 10 values', () => {
    const values = Object.values(RunStatus);
    expect(values).toHaveLength(10);
  });
});
