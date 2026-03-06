import { CredentialsHTTP } from '../Credentials';

describe('CredentialsHTTP', () => {
  it('stores venueId, apiKey, and userId', () => {
    const cred = new CredentialsHTTP('did:web:example.com', 'key-123', 'user@test.com');
    expect(cred.venueId).toBe('did:web:example.com');
    expect(cred.apiKey).toBe('key-123');
    expect(cred.userId).toBe('user@test.com');
  });

  it('allows empty strings', () => {
    const cred = new CredentialsHTTP('', '', '');
    expect(cred.venueId).toBe('');
    expect(cred.apiKey).toBe('');
    expect(cred.userId).toBe('');
  });

  it('implements Credentials interface shape', () => {
    const cred = new CredentialsHTTP('v', 'k', 'u');
    expect(cred).toHaveProperty('venueId');
    expect(cred).toHaveProperty('apiKey');
    expect(cred).toHaveProperty('userId');
  });
});
