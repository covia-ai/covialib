import { NoAuth, BearerAuth, BasicAuth, CoviaUserAuth, Auth } from '../Credentials';

describe('NoAuth', () => {
  it('does not modify headers', () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    new NoAuth().apply(headers);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('is an instance of Auth', () => {
    expect(new NoAuth()).toBeInstanceOf(Auth);
  });
});

describe('BearerAuth', () => {
  it('adds Authorization Bearer header', () => {
    const headers: Record<string, string> = {};
    new BearerAuth('my-token').apply(headers);
    expect(headers['Authorization']).toBe('Bearer my-token');
  });

  it('is an instance of Auth', () => {
    expect(new BearerAuth('t')).toBeInstanceOf(Auth);
  });
});

describe('BasicAuth', () => {
  it('adds Authorization Basic header with base64 encoding', () => {
    const headers: Record<string, string> = {};
    new BasicAuth('user', 'pass').apply(headers);
    expect(headers['Authorization']).toBe(`Basic ${btoa('user:pass')}`);
  });

  it('is an instance of Auth', () => {
    expect(new BasicAuth('u', 'p')).toBeInstanceOf(Auth);
  });
});

describe('CoviaUserAuth', () => {
  it('adds X-Covia-User header when userId is non-empty', () => {
    const headers: Record<string, string> = {};
    new CoviaUserAuth('user@test.com').apply(headers);
    expect(headers['X-Covia-User']).toBe('user@test.com');
  });

  it('does not add X-Covia-User header when userId is empty', () => {
    const headers: Record<string, string> = {};
    new CoviaUserAuth('').apply(headers);
    expect(headers['X-Covia-User']).toBeUndefined();
  });

  it('is an instance of Auth', () => {
    expect(new CoviaUserAuth('u')).toBeInstanceOf(Auth);
  });
});
