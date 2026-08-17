// mobile/src/features/home/mockData.ts
export interface MockTask {
  id: string;
  time: string;
  title: string;
  priority: 'high' | 'normal';
}

export const MOCK_ONGOING_CARE = {
  clientName: 'Dona Marta',
  clockInTime: '09:30',
};

export const MOCK_TODAYS_TASKS: MockTask[] = [
  { id: '1', time: '10:00', title: 'Medicamento — Losartana', priority: 'high' },
  { id: '2', time: '12:00', title: 'Almoço e hidratação', priority: 'normal' },
  { id: '3', time: '15:30', title: 'Caminhada leve', priority: 'normal' },
];

export interface MockMedication {
  id: string;
  name: string;
  time: string;
  status: 'taken' | 'pending' | 'late';
}

export const MOCK_MEDICATIONS: MockMedication[] = [
  { id: '1', name: 'Losartana 50mg', time: '08:00', status: 'taken' },
  { id: '2', name: 'Metformina 850mg', time: '13:00', status: 'pending' },
  { id: '3', name: 'Vitamina D3', time: '20:00', status: 'late' },
];

export const MOCK_VITAL_SIGNS = {
  bloodPressure: '128/82 mmHg',
  glucose: '110 mg/dL',
  weight: '68 kg',
  recordedAt: '17/08 · 07:30',
};

export const MOCK_APPOINTMENT = {
  specialty: 'Cardiologista',
  doctorName: 'Dr. Carlos Mendes',
  date: '22/08',
  time: '14:30',
  location: 'Clínica Vida, sala 302',
};

export const MOCK_CARED_PERSON_NAME = 'Dona Marta';
