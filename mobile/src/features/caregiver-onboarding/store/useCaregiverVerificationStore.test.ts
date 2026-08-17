import { useCaregiverVerificationStore } from './useCaregiverVerificationStore';

describe('useCaregiverVerificationStore', () => {
  beforeEach(() => {
    useCaregiverVerificationStore.getState().reset();
  });

  it('starts with pending status and empty contact fields', () => {
    const state = useCaregiverVerificationStore.getState();
    expect(state.documentType).toBeNull();
    expect(state.documentStatus).toBe('pending');
    expect(state.phone).toBe('');
    expect(state.phoneVerified).toBe(false);
    expect(state.email).toBe('');
    expect(state.emailVerified).toBe(false);
    expect(state.faceStatus).toBe('pending');
    expect(state.applicationStatus).toBe('in_review');
  });

  it('tracks document type and capture status independently', () => {
    const { setDocumentType, setDocumentStatus } = useCaregiverVerificationStore.getState();
    setDocumentType('cnh');
    setDocumentStatus('analyzing');

    const state = useCaregiverVerificationStore.getState();
    expect(state.documentType).toBe('cnh');
    expect(state.documentStatus).toBe('analyzing');
  });

  it('resets every field back to its initial value', () => {
    const store = useCaregiverVerificationStore.getState();
    store.setDocumentType('rg');
    store.setPhone('11999999999');
    store.setPhoneVerified(true);
    store.setEmail('maria@email.com');
    store.setEmailVerified(true);
    store.setFaceStatus('success');
    store.setApplicationStatus('approved');

    useCaregiverVerificationStore.getState().reset();

    expect(useCaregiverVerificationStore.getState()).toMatchObject({
      documentType: null,
      documentStatus: 'pending',
      phone: '',
      phoneVerified: false,
      email: '',
      emailVerified: false,
      faceStatus: 'pending',
      applicationStatus: 'in_review',
    });
  });
});
