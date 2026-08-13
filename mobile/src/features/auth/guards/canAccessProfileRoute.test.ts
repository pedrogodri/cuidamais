import { canAccessProfileRoute } from './canAccessProfileRoute';

describe('canAccessProfileRoute', () => {
  it('denies access when there is no session', () => {
    expect(canAccessProfileRoute(null, { type: 'caregiver', id: 'p1' }, 'caregiver')).toBe(false);
  });

  it('denies access when there is no active profile', () => {
    expect(canAccessProfileRoute({ token: 't' }, null, 'caregiver')).toBe(false);
  });

  it('denies access when the active profile type does not match', () => {
    expect(canAccessProfileRoute({ token: 't' }, { type: 'family', id: 'p1' }, 'caregiver')).toBe(
      false,
    );
  });

  it('allows access when session and matching active profile are present', () => {
    expect(
      canAccessProfileRoute({ token: 't' }, { type: 'caregiver', id: 'p1' }, 'caregiver'),
    ).toBe(true);
  });
});
