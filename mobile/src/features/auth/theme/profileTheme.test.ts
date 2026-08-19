import {
  getProfileIconColorHex,
  getProfileTheme,
  PROFILE_ORDER,
  parseProfileType,
} from './profileTheme';

describe('getProfileTheme', () => {
  it('returns petrol tokens for caregiver', () => {
    expect(getProfileTheme('caregiver').bgClass500).toBe('bg-petrol-500');
  });

  it('returns amber tokens for cared_person and forces dark text (contrast rule)', () => {
    const theme = getProfileTheme('cared_person');
    expect(theme.bgClass500).toBe('bg-amber-500');
    expect(theme.textClass900OnAmber).toBe('text-neutral-900');
  });

  it('returns vinculo tokens for family', () => {
    expect(getProfileTheme('family').bgClass500).toBe('bg-vinculo-500');
  });

  it('lists all three profile types in a stable order', () => {
    expect(PROFILE_ORDER).toEqual(['caregiver', 'cared_person', 'family']);
  });
});

describe('parseProfileType', () => {
  it('accepts a known profile type', () => {
    expect(parseProfileType('family')).toBe('family');
  });

  it('falls back to caregiver for missing or unknown values', () => {
    expect(parseProfileType(undefined)).toBe('caregiver');
    expect(parseProfileType('not-a-profile')).toBe('caregiver');
  });

  it('unwraps an array param (expo-router can pass repeated query keys as arrays)', () => {
    expect(parseProfileType(['vinculo-ish', 'family'])).toBe('caregiver');
    expect(parseProfileType(['family'])).toBe('family');
  });
});

describe('getProfileIconColorHex', () => {
  it('returns the -700 hex shade for each profile type', () => {
    expect(getProfileIconColorHex('caregiver')).toBe('#123D36');
    expect(getProfileIconColorHex('cared_person')).toBe('#A9721F');
    expect(getProfileIconColorHex('family')).toBe('#A8455F');
  });
});
