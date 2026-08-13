import { useActiveProfileStore } from './useActiveProfileStore';

describe('useActiveProfileStore', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('starts with no active profile', () => {
    expect(useActiveProfileStore.getState().activeProfile).toBeNull();
  });

  it('sets the active profile', () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'p1' });

    expect(useActiveProfileStore.getState().activeProfile).toEqual({
      type: 'caregiver',
      id: 'p1',
    });
  });

  it('clears the active profile', () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'p2' });
    useActiveProfileStore.getState().clearActiveProfile();

    expect(useActiveProfileStore.getState().activeProfile).toBeNull();
  });
});
