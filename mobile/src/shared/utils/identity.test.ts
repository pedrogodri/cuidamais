import { identity } from './identity';

describe('identity', () => {
  it('returns the value unchanged', () => {
    expect(identity(42)).toBe(42);
  });
});
