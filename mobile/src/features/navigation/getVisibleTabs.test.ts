import { isTabVisible } from './getVisibleTabs';

describe('isTabVisible', () => {
  it('home is always visible, with or without an active profile', () => {
    expect(isTabVisible('home', null)).toBe(true);
    expect(isTabVisible('home', 'caregiver')).toBe(true);
    expect(isTabVisible('home', 'family')).toBe(true);
    expect(isTabVisible('home', 'cared_person')).toBe(true);
  });

  it('perfil só é visível pro Cuidador', () => {
    expect(isTabVisible('perfil', 'caregiver')).toBe(true);
    expect(isTabVisible('perfil', 'family')).toBe(false);
    expect(isTabVisible('perfil', 'cared_person')).toBe(false);
    expect(isTabVisible('perfil', null)).toBe(false);
  });

  it('buscar é visível pra Família e Pessoa cuidada, não pro Cuidador', () => {
    expect(isTabVisible('buscar', 'family')).toBe(true);
    expect(isTabVisible('buscar', 'cared_person')).toBe(true);
    expect(isTabVisible('buscar', 'caregiver')).toBe(false);
    expect(isTabVisible('buscar', null)).toBe(false);
  });

  it('agenda e chat exigem algum perfil ativo, qualquer um dos três', () => {
    expect(isTabVisible('agenda', 'caregiver')).toBe(true);
    expect(isTabVisible('agenda', 'family')).toBe(true);
    expect(isTabVisible('agenda', 'cared_person')).toBe(true);
    expect(isTabVisible('agenda', null)).toBe(false);

    expect(isTabVisible('chat', 'caregiver')).toBe(true);
    expect(isTabVisible('chat', 'family')).toBe(true);
    expect(isTabVisible('chat', 'cared_person')).toBe(true);
    expect(isTabVisible('chat', null)).toBe(false);
  });
});
