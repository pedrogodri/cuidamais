import { create } from 'zustand';

export type DocumentType = 'rg' | 'cnh' | 'other';
export type CaptureStatus = 'pending' | 'capturing' | 'uploaded' | 'analyzing' | 'invalid';
export type FaceStatus = 'pending' | 'capturing' | 'analyzing' | 'success' | 'failed';
export type ApplicationStatus = 'in_review' | 'approved' | 'needs_correction' | 'rejected';

interface CaregiverVerificationState {
  documentType: DocumentType | null;
  documentStatus: CaptureStatus;
  phone: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  faceStatus: FaceStatus;
  applicationStatus: ApplicationStatus;
  setDocumentType: (type: DocumentType) => void;
  setDocumentStatus: (status: CaptureStatus) => void;
  setPhone: (phone: string) => void;
  setPhoneVerified: (verified: boolean) => void;
  setEmail: (email: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setFaceStatus: (status: FaceStatus) => void;
  setApplicationStatus: (status: ApplicationStatus) => void;
  reset: () => void;
}

const initialState = {
  documentType: null as DocumentType | null,
  documentStatus: 'pending' as CaptureStatus,
  phone: '',
  phoneVerified: false,
  email: '',
  emailVerified: false,
  faceStatus: 'pending' as FaceStatus,
  applicationStatus: 'in_review' as ApplicationStatus,
};

export const useCaregiverVerificationStore = create<CaregiverVerificationState>((set) => ({
  ...initialState,
  setDocumentType: (documentType) => set({ documentType }),
  setDocumentStatus: (documentStatus) => set({ documentStatus }),
  setPhone: (phone) => set({ phone }),
  setPhoneVerified: (phoneVerified) => set({ phoneVerified }),
  setEmail: (email) => set({ email }),
  setEmailVerified: (emailVerified) => set({ emailVerified }),
  setFaceStatus: (faceStatus) => set({ faceStatus }),
  setApplicationStatus: (applicationStatus) => set({ applicationStatus }),
  reset: () => set(initialState),
}));
