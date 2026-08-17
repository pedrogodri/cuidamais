# Home unificada — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o placeholder de `app/(shared)/home.tsx` pela Home real, que se adapta ao perfil ativo (Cuidador / Responsável / Pessoa cuidada) e mostra conteúdo mockado de cada modo.

**Architecture:** `app/(shared)/home.tsx` lê `useActiveProfileStore` e monta header + seletor de perfil (teste) + cards de conteúdo específicos do modo ativo. Todo o código novo mora em `src/features/home/` (mock data, componentes, e duas funções puras testáveis isoladamente — `getGreeting` e `formatElapsed`).

**Tech Stack:** React Native, Expo Router, NativeWind (tokens já configurados em `tailwind.config.js`), Zustand (`useActiveProfileStore`, já existente), `@expo/vector-icons`, Jest + React Native Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-17-unified-home-design.md`

## Global Constraints

- Sem anéis de atividade/sono/calorias — só remédios, sinais vitais (pressão/glicemia/peso), agenda de consultas.
- Cards mostram dado mockado; nenhum card navega pra tela de detalhe.
- Modo Cuidador mostra um atendimento mockado como sempre ativo (sem estado "sem atendimento").
- Seletor de perfil (`ProfileModeSwitcher`) chama `setActiveProfile` de verdade — não é decorativo.
- Header tem saudação + avatar (iniciais) + sino de notificação, sem destino de navegação ainda.
- Todo texto em português, seguindo o tom de voz do design system (direto, sem infantilizar — ver `mobile/docs/design/design-system.md` seção 10).
- Usar sempre os componentes/tokens já existentes: `Button` (`src/shared/ui/Button.tsx`), classes NativeWind do design system (`bg-petrol-500`, `text-h3`, etc. — não inventar valor solto), `useSafeAreaInsets` para padding de topo/rodapé (nunca `pt-N` fixo — ver `mobile/docs/conventions.md`).
- Componentes testados com `await render(...)` / `await fireEvent...(...)` (ver `mobile/docs/conventions.md` sobre o gotcha do RTL).
- Rodar `npm test` (não `npx jest` direto) — já inclui a flag de Node necessária neste projeto.

---

### Task 1: Mock data para a Home

**Files:**
- Create: `mobile/src/features/home/mockData.ts`

**Interfaces:**
- Produces: `MockTask` (interface), `MOCK_ONGOING_CARE`, `MOCK_TODAYS_TASKS: MockTask[]`, `MockMedication` (interface), `MOCK_MEDICATIONS: MockMedication[]`, `MOCK_VITAL_SIGNS`, `MOCK_APPOINTMENT`, `MOCK_CARED_PERSON_NAME: string` — todos consumidos pela Task 8.

Dado estático, sem lógica — não precisa de teste próprio.

- [ ] **Step 1: Criar o arquivo de mock data**

```ts
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
```

- [ ] **Step 2: Rodar typecheck**

Run: `cd mobile && npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/features/home/mockData.ts
git commit -m "feat: add mock data for the unified Home screen"
```

---

### Task 2: `getGreeting` — saudação por horário

**Files:**
- Create: `mobile/src/features/home/getGreeting.ts`
- Test: `mobile/src/features/home/getGreeting.test.ts`

**Interfaces:**
- Produces: `getGreeting(date?: Date): string` — consumido pela Task 4 (`HomeHeader`).

- [ ] **Step 1: Escrever o teste (vai falhar — o arquivo ainda não existe)**

```ts
// mobile/src/features/home/getGreeting.test.ts
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
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `cd mobile && npm test -- getGreeting`
Expected: FAIL — `Cannot find module './getGreeting'`

- [ ] **Step 3: Implementar**

```ts
// mobile/src/features/home/getGreeting.ts
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `cd mobile && npm test -- getGreeting`
Expected: PASS — 4 testes.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/home/getGreeting.ts mobile/src/features/home/getGreeting.test.ts
git commit -m "feat: add time-of-day greeting helper for the Home header"
```

---

### Task 3: `formatElapsed` — formata o cronômetro do atendimento

**Files:**
- Create: `mobile/src/features/home/formatElapsed.ts`
- Test: `mobile/src/features/home/formatElapsed.test.ts`

**Interfaces:**
- Produces: `formatElapsed(totalSeconds: number): string` (formato `HH:MM:SS`) — consumido pela Task 6 (`OngoingCareCard`).

- [ ] **Step 1: Escrever o teste**

```ts
// mobile/src/features/home/formatElapsed.test.ts
import { formatElapsed } from './formatElapsed';

describe('formatElapsed', () => {
  it('formata zero segundos como 00:00:00', () => {
    expect(formatElapsed(0)).toBe('00:00:00');
  });

  it('formata minutos e segundos', () => {
    expect(formatElapsed(125)).toBe('00:02:05');
  });

  it('formata horas', () => {
    expect(formatElapsed(3661)).toBe('01:01:01');
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `cd mobile && npm test -- formatElapsed`
Expected: FAIL — `Cannot find module './formatElapsed'`

- [ ] **Step 3: Implementar**

```ts
// mobile/src/features/home/formatElapsed.ts
export function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `cd mobile && npm test -- formatElapsed`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/home/formatElapsed.ts mobile/src/features/home/formatElapsed.test.ts
git commit -m "feat: add elapsed-time formatter for the ongoing-care timer"
```

---

### Task 4: `HomeHeader`

**Files:**
- Create: `mobile/src/features/home/components/HomeHeader.tsx`
- Test: `mobile/src/features/home/components/HomeHeader.test.tsx`

**Interfaces:**
- Consumes: `getGreeting` de `../getGreeting` (Task 2).
- Produces: `HomeHeader({ name: string })` — consumido pela Task 8.

- [ ] **Step 1: Escrever o teste**

```tsx
// mobile/src/features/home/components/HomeHeader.test.tsx
import { render, screen } from '@testing-library/react-native';
import { HomeHeader } from './HomeHeader';

describe('HomeHeader', () => {
  it('renderiza o nome recebido', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByText('Maria Silva')).toBeTruthy();
  });

  it('renderiza as iniciais do nome no avatar', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByText('MS')).toBeTruthy();
  });

  it('expõe o sino de notificação como botão acessível', async () => {
    await render(<HomeHeader name="Maria Silva" />);
    expect(screen.getByLabelText('Notificações')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `cd mobile && npm test -- HomeHeader`
Expected: FAIL — `Cannot find module './HomeHeader'`

- [ ] **Step 3: Implementar**

```tsx
// mobile/src/features/home/components/HomeHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { getGreeting } from '../getGreeting';

interface HomeHeaderProps {
  name: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function HomeHeader({ name }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-petrol-100">
          <Text className="font-display-medium text-body-lg text-petrol-700">
            {getInitials(name)}
          </Text>
        </View>
        <View>
          <Text className="font-body text-caption text-neutral-500">{getGreeting()}</Text>
          <Text className="font-display-medium text-h3 text-neutral-900">{name}</Text>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Notificações" hitSlop={12}>
        <Ionicons name="notifications-outline" size={24} color="#26302E" />
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `cd mobile && npm test -- HomeHeader`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/home/components/HomeHeader.tsx mobile/src/features/home/components/HomeHeader.test.tsx
git commit -m "feat: add Home header with greeting, avatar initials and notification icon"
```

---

### Task 5: `ProfileModeSwitcher`

**Files:**
- Create: `mobile/src/features/home/components/ProfileModeSwitcher.tsx`
- Test: `mobile/src/features/home/components/ProfileModeSwitcher.test.tsx`

**Interfaces:**
- Consumes: `useActiveProfileStore` (`src/features/auth/store/useActiveProfileStore.ts`, já existe — `activeProfile`, `setActiveProfile`), `getProfileTheme` e `PROFILE_ORDER` (`src/features/auth/theme/profileTheme.ts`, já existem).
- Produces: `ProfileModeSwitcher()` — sem props, lê/escreve direto no store global. Consumido pela Task 8.

- [ ] **Step 1: Escrever o teste**

```tsx
// mobile/src/features/home/components/ProfileModeSwitcher.test.tsx
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ProfileModeSwitcher } from './ProfileModeSwitcher';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';

describe('ProfileModeSwitcher', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('renderiza os três modos de perfil', async () => {
    await render(<ProfileModeSwitcher />);
    expect(screen.getByText('Cuidador')).toBeTruthy();
    expect(screen.getByText('Pessoa cuidada')).toBeTruthy();
    expect(screen.getByText('Responsável')).toBeTruthy();
  });

  it('ativa o perfil Cuidador no store ao tocar no chip', async () => {
    await render(<ProfileModeSwitcher />);
    await fireEvent.press(screen.getByText('Cuidador'));
    expect(useActiveProfileStore.getState().activeProfile?.type).toBe('caregiver');
  });

  it('marca o chip do perfil ativo como selecionado', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<ProfileModeSwitcher />);
    expect(screen.getByRole('radio', { name: /Responsável/ })).toHaveProp('accessibilityState', {
      selected: true,
    });
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `cd mobile && npm test -- ProfileModeSwitcher`
Expected: FAIL — `Cannot find module './ProfileModeSwitcher'`

- [ ] **Step 3: Implementar**

```tsx
// mobile/src/features/home/components/ProfileModeSwitcher.tsx
import { Pressable, Text, View } from 'react-native';
import {
  useActiveProfileStore,
  type ProfileType,
} from '@/features/auth/store/useActiveProfileStore';
import { getProfileTheme, PROFILE_ORDER } from '@/features/auth/theme/profileTheme';

export function ProfileModeSwitcher() {
  const activeType = useActiveProfileStore((state) => state.activeProfile?.type);
  const setActiveProfile = useActiveProfileStore((state) => state.setActiveProfile);

  function handleSelect(type: ProfileType) {
    setActiveProfile({ type, id: 'preview' });
  }

  return (
    <View accessibilityRole="radiogroup" className="flex-row gap-2">
      {PROFILE_ORDER.map((type) => {
        const theme = getProfileTheme(type);
        const selected = activeType === type;
        return (
          <Pressable
            key={type}
            accessibilityRole="radio"
            accessibilityLabel={theme.label}
            accessibilityState={{ selected }}
            onPress={() => handleSelect(type)}
            className={`flex-1 items-center rounded-pill border-2 px-3 py-2 ${
              selected
                ? `${theme.borderClass500} ${theme.bgClass100}`
                : 'border-transparent bg-neutral-100'
            }`}
          >
            <Text
              className={`font-body-medium text-caption ${
                selected ? theme.textClass700 : 'text-neutral-500'
              }`}
            >
              {theme.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `cd mobile && npm test -- ProfileModeSwitcher`
Expected: PASS — 3 testes.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/home/components/ProfileModeSwitcher.tsx mobile/src/features/home/components/ProfileModeSwitcher.test.tsx
git commit -m "feat: add profile-mode test switcher to the Home screen"
```

---

### Task 6: Cards do modo Cuidador — `OngoingCareCard` e `TodaysTasksCard`

**Files:**
- Create: `mobile/src/features/home/components/OngoingCareCard.tsx`
- Create: `mobile/src/features/home/components/TodaysTasksCard.tsx`

**Interfaces:**
- Consumes: `formatElapsed` de `../formatElapsed` (Task 3), `Button` de `@/shared/ui/Button`, `MockTask` de `../mockData` (Task 1).
- Produces: `OngoingCareCard({ clientName: string, clockInTime: string })`, `TodaysTasksCard({ tasks: MockTask[] })` — ambos consumidos pela Task 8.

Puramente apresentacionais sobre dado já passado via props — sem teste próprio, mesmo padrão de `MedicationsCard`/`VitalSignsCard` na Task 7 (a lógica que importa, `formatElapsed`, já está testada isoladamente).

- [ ] **Step 1: Criar `OngoingCareCard`**

```tsx
// mobile/src/features/home/components/OngoingCareCard.tsx
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Button } from '@/shared/ui/Button';
import { formatElapsed } from '../formatElapsed';

interface OngoingCareCardProps {
  clientName: string;
  clockInTime: string;
}

export function OngoingCareCard({ clientName, clockInTime }: OngoingCareCardProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="gap-4 rounded-md border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-body-medium text-caption uppercase tracking-widest text-neutral-500">
          Atendimento em andamento
        </Text>
        <View className="h-2 w-2 rounded-full bg-success-500" />
      </View>

      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-petrol-100">
          <Ionicons name="person-outline" size={22} color="#1C5D52" />
        </View>
        <View>
          <Text className="font-display-medium text-h3 text-neutral-900">{clientName}</Text>
          <Text className="font-body text-caption text-neutral-500">
            Clock-in às {clockInTime}
          </Text>
        </View>
      </View>

      <View className="items-center rounded-sm bg-petrol-100 py-4">
        <Text className="font-mono text-h1 text-petrol-700">{formatElapsed(elapsedSeconds)}</Text>
        <Text className="font-body text-caption text-neutral-700">Tempo trabalhado</Text>
      </View>

      <Button label="Finalizar atendimento" tone="petrol" onPress={() => {}} />
    </View>
  );
}
```

- [ ] **Step 2: Criar `TodaysTasksCard`**

```tsx
// mobile/src/features/home/components/TodaysTasksCard.tsx
import { Text, View } from 'react-native';
import type { MockTask } from '../mockData';

interface TodaysTasksCardProps {
  tasks: MockTask[];
}

export function TodaysTasksCard({ tasks }: TodaysTasksCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <Text className="font-display-medium text-h3 text-neutral-900">Tarefas de hoje</Text>
      <View className="gap-3">
        {tasks.map((task) => (
          <View key={task.id} className="flex-row items-center gap-3">
            <Text className="font-mono text-caption text-neutral-500">{task.time}</Text>
            <Text className="font-body-medium text-body flex-1 text-neutral-900">
              {task.title}
            </Text>
            {task.priority === 'high' ? (
              <View className="rounded-pill bg-amber-100 px-3 py-1">
                <Text className="font-body-medium text-caption text-amber-700">
                  Alta prioridade
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Rodar typecheck e lint**

Run: `cd mobile && npx tsc --noEmit && ESLINT_USE_FLAT_CONFIG=false npx eslint src/features/home --ext .ts,.tsx`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add mobile/src/features/home/components/OngoingCareCard.tsx mobile/src/features/home/components/TodaysTasksCard.tsx
git commit -m "feat: add caregiver-mode Home cards (ongoing care, today's tasks)"
```

---

### Task 7: Cards do modo Responsável/Pessoa cuidada

**Files:**
- Create: `mobile/src/features/home/components/MedicationsCard.tsx`
- Create: `mobile/src/features/home/components/VitalSignsCard.tsx`
- Create: `mobile/src/features/home/components/UpcomingAppointmentCard.tsx`

**Interfaces:**
- Consumes: `MockMedication` de `../mockData` (Task 1).
- Produces: `MedicationsCard({ medications: MockMedication[] })`, `VitalSignsCard({ bloodPressure, glucose, weight, recordedAt }: { bloodPressure: string; glucose: string; weight: string; recordedAt: string })`, `UpcomingAppointmentCard({ specialty, doctorName, date, time, location }: { specialty: string; doctorName: string; date: string; time: string; location: string })` — todos consumidos pela Task 8.

Presentational, mesmo raciocínio da Task 6 — sem teste próprio.

- [ ] **Step 1: Criar `MedicationsCard`**

```tsx
// mobile/src/features/home/components/MedicationsCard.tsx
import { Text, View } from 'react-native';
import type { MockMedication } from '../mockData';

const STATUS_LABEL: Record<MockMedication['status'], string> = {
  taken: 'Tomado',
  pending: 'Pendente',
  late: 'Atrasado',
};

const STATUS_CLASSES: Record<MockMedication['status'], { bg: string; text: string }> = {
  taken: { bg: 'bg-success-100', text: 'text-success-700' },
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
  late: { bg: 'bg-error-100', text: 'text-error-500' },
};

interface MedicationsCardProps {
  medications: MockMedication[];
}

export function MedicationsCard({ medications }: MedicationsCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <Text className="font-display-medium text-h3 text-neutral-900">Remédios de hoje</Text>
      <View className="gap-3">
        {medications.map((med) => {
          const statusClasses = STATUS_CLASSES[med.status];
          return (
            <View key={med.id} className="flex-row items-center gap-3">
              <Text className="font-mono text-caption text-neutral-500">{med.time}</Text>
              <Text className="font-body-medium text-body flex-1 text-neutral-900">
                {med.name}
              </Text>
              <View className={`rounded-pill px-3 py-1 ${statusClasses.bg}`}>
                <Text className={`font-body-medium text-caption ${statusClasses.text}`}>
                  {STATUS_LABEL[med.status]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Criar `VitalSignsCard`**

```tsx
// mobile/src/features/home/components/VitalSignsCard.tsx
import { Text, View } from 'react-native';

interface VitalSignsCardProps {
  bloodPressure: string;
  glucose: string;
  weight: string;
  recordedAt: string;
}

export function VitalSignsCard({
  bloodPressure,
  glucose,
  weight,
  recordedAt,
}: VitalSignsCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-display-medium text-h3 text-neutral-900">Sinais vitais</Text>
        <Text className="font-body text-caption text-neutral-500">{recordedAt}</Text>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Pressão</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{bloodPressure}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Glicemia</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{glucose}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="font-body text-caption text-neutral-500">Peso</Text>
          <Text className="font-mono text-body-lg text-neutral-900">{weight}</Text>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Criar `UpcomingAppointmentCard`**

```tsx
// mobile/src/features/home/components/UpcomingAppointmentCard.tsx
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface UpcomingAppointmentCardProps {
  specialty: string;
  doctorName: string;
  date: string;
  time: string;
  location: string;
}

export function UpcomingAppointmentCard({
  specialty,
  doctorName,
  date,
  time,
  location,
}: UpcomingAppointmentCardProps) {
  return (
    <View className="gap-3 rounded-md border border-neutral-200 bg-white p-4">
      <Text className="font-display-medium text-h3 text-neutral-900">Próxima consulta</Text>
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-vinculo-100">
          <Ionicons name="calendar-outline" size={20} color="#A8455F" />
        </View>
        <View className="flex-1">
          <Text className="font-body-medium text-body text-neutral-900">{specialty}</Text>
          <Text className="font-body text-caption text-neutral-500">{doctorName}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-clear-outline" size={14} color="#5C6B67" />
          <Text className="font-body text-caption text-neutral-700">
            {date} · {time}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color="#5C6B67" />
          <Text className="font-body text-caption text-neutral-700">{location}</Text>
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Rodar typecheck e lint**

Run: `cd mobile && npx tsc --noEmit && ESLINT_USE_FLAT_CONFIG=false npx eslint src/features/home --ext .ts,.tsx`
Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/home/components/MedicationsCard.tsx mobile/src/features/home/components/VitalSignsCard.tsx mobile/src/features/home/components/UpcomingAppointmentCard.tsx
git commit -m "feat: add family-mode Home cards (medications, vital signs, appointment)"
```

---

### Task 8: Montar `app/(shared)/home.tsx`

**Files:**
- Modify: `mobile/app/(shared)/home.tsx` (reescrita completa — hoje é o placeholder com só o botão "Quero ser cuidador")

**Interfaces:**
- Consumes: todos os componentes das Tasks 4–7, todo mock data da Task 1, `useActiveProfileStore` (existente), `Button` (existente), `router` de `expo-router`.

- [ ] **Step 1: Reescrever a tela**

```tsx
// mobile/app/(shared)/home.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { MedicationsCard } from '@/features/home/components/MedicationsCard';
import { OngoingCareCard } from '@/features/home/components/OngoingCareCard';
import { ProfileModeSwitcher } from '@/features/home/components/ProfileModeSwitcher';
import { TodaysTasksCard } from '@/features/home/components/TodaysTasksCard';
import { UpcomingAppointmentCard } from '@/features/home/components/UpcomingAppointmentCard';
import { VitalSignsCard } from '@/features/home/components/VitalSignsCard';
import {
  MOCK_APPOINTMENT,
  MOCK_CARED_PERSON_NAME,
  MOCK_MEDICATIONS,
  MOCK_ONGOING_CARE,
  MOCK_TODAYS_TASKS,
  MOCK_VITAL_SIGNS,
} from '@/features/home/mockData';

export default function Home() {
  const insets = useSafeAreaInsets();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const isFamilyMode = activeProfile?.type === 'family' || activeProfile?.type === 'cared_person';

  return (
    <ScrollView
      className="flex-1 bg-neutral-0"
      contentContainerClassName="gap-6 px-4"
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}
    >
      <HomeHeader name="Maria Silva" />
      <ProfileModeSwitcher />

      {activeProfile?.type === 'caregiver' ? (
        <View className="gap-4">
          <OngoingCareCard
            clientName={MOCK_ONGOING_CARE.clientName}
            clockInTime={MOCK_ONGOING_CARE.clockInTime}
          />
          <TodaysTasksCard tasks={MOCK_TODAYS_TASKS} />
        </View>
      ) : null}

      {isFamilyMode ? (
        <View className="gap-4">
          {activeProfile?.type === 'family' ? (
            <Text className="font-body-medium text-caption text-neutral-500">
              Cuidando de: {MOCK_CARED_PERSON_NAME}
            </Text>
          ) : null}
          <MedicationsCard medications={MOCK_MEDICATIONS} />
          <VitalSignsCard {...MOCK_VITAL_SIGNS} />
          <UpcomingAppointmentCard {...MOCK_APPOINTMENT} />
        </View>
      ) : null}

      {!activeProfile ? (
        <View className="items-center gap-3 rounded-md border border-dashed border-neutral-300 bg-white p-6">
          <Ionicons name="hand-left-outline" size={28} color="#8B8880" />
          <Text className="text-center font-body text-body text-neutral-700">
            Escolha um modo acima para ver sua Home.
          </Text>
        </View>
      ) : null}

      {activeProfile?.type !== 'caregiver' ? (
        <View className="gap-3 border-t border-neutral-100 pt-6">
          <Text className="font-body text-body text-neutral-500">
            Quer prestar cuidado profissional? Ative um perfil de Cuidador na mesma conta.
          </Text>
          <Button
            label="Quero ser cuidador"
            variant="secondary"
            onPress={() => router.push('/(caregiver-onboarding)/intro')}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
```

- [ ] **Step 2: Rodar typecheck, lint e a suíte inteira**

Run: `cd mobile && npx tsc --noEmit && ESLINT_USE_FLAT_CONFIG=false npx eslint . --ext .ts,.tsx && npm test`
Expected: tudo passando, incluindo os testes das Tasks 2, 3, 4 e 5.

- [ ] **Step 3: Formatar com Prettier**

Run: `cd mobile && npx prettier --write "app/(shared)/home.tsx" "src/features/home/**/*.{ts,tsx}"`

- [ ] **Step 4: Verificação visual no simulador**

Com o app rodando (`npm run ios` já buildado, Metro conectado):
1. `xcrun simctl openurl booted "cuidamais://home"`
2. Tocar em cada um dos 3 chips do seletor e confirmar visualmente: Cuidador mostra atendimento+tarefas; Pessoa cuidada e Responsável mostram remédios+sinais vitais+consulta (Responsável com a legenda "Cuidando de:"); o CTA "Quero ser cuidador" some quando o modo Cuidador está ativo.
3. Tocar em "Quero ser cuidador" e confirmar que abre `(caregiver-onboarding)/intro` normalmente.

- [ ] **Step 5: Commit**

```bash
git add mobile/app/\(shared\)/home.tsx
git commit -m "feat: build the real unified Home screen (replaces placeholder)"
```

---

### Task 9: Documentar o resultado

**Files:**
- Create: `mobile/docs/features/home.md`
- Modify: `mobile/CLAUDE.md` (adicionar `home.md` à lista de feature docs)

- [ ] **Step 1: Escrever `mobile/docs/features/home.md`**

Seguir o mesmo formato de `mobile/docs/features/auth-flow.md` e
`mobile/docs/features/caregiver-onboarding.md`: o que existe, por que a
Home muda por perfil ativo, quais dados são mockados (todos — remédios,
sinais vitais, agenda, atendimento), e como usar o `ProfileModeSwitcher`
pra revisar os três modos sem login real. Linkar de volta pro spec
(`docs/superpowers/specs/2026-08-17-unified-home-design.md`) como registro
da decisão original.

- [ ] **Step 2: Adicionar a nova doc à lista em `mobile/CLAUDE.md`**

Na seção "Feature/flow docs", adicionar uma linha:

```
- `docs/features/home.md` — a Home unificada, como ela muda por perfil ativo, o que é mockado.
```

- [ ] **Step 3: Commit**

```bash
git add mobile/docs/features/home.md mobile/CLAUDE.md
git commit -m "docs: document the unified Home screen"
```
