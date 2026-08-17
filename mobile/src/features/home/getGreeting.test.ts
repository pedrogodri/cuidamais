import { getGreeting } from './getGreeting';

describe('getGreeting', () => {
  it('retorna "Bom dia" antes do meio-dia', () => {
    expect(getGreeting(new Date('2026-01-01T09:00:00'))).toBe('Bom dia');
  });

  it('retorna "Boa tarde" entre meio-dia e 18h', () => {
    expect(getGreeting(new Date('2026-01-01T15:00:00'))).toBe('Boa tarde');
  });

  it('retorna "Boa noite" a partir das 18h', () => {
    expect(getGreeting(new Date('2026-01-01T20:00:00'))).toBe('Boa noite');
  });

  it('usa a hora atual quando nenhuma data é passada', () => {
    expect(typeof getGreeting()).toBe('string');
  });
});
