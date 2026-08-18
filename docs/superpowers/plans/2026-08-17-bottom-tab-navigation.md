# Bottom Tab Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the pushed, headerless Home + the orphaned `(caregiver)`/`(family)` route groups with a single persistent bottom tab bar (`app/(shared)/(tabs)/`) whose visible tabs change with the active profile, styled with a profile-colored pill behind the active tab's icon+label.

**Architecture:** One `Tabs` navigator lives at `app/(shared)/(tabs)/_layout.tsx`, guarded only by session (not profile type). Each `Tabs.Screen` is hidden per-tab via `options.href = null` computed from `useActiveProfileStore`'s active profile type, using a pure predicate (`isTabVisible`) so the visibility rules are unit-testable without rendering the navigator. Active-tab color comes from the same `getProfileTheme`/`getProfileIconColorHex` helpers already used by `ProfileSwitcherDropdown`. Home and the caregiver's public profile (`(caregiver)/index.tsx`) move into this group with minor edits (Home loses its now-redundant "Ver meu perfil público" CTA; the profile screen loses its push-only back button); `(caregiver)` and `(family)` route groups are deleted.

**Tech Stack:** Expo Router `Tabs` (`import { Tabs } from 'expo-router'`, confirmed still the way this project imports it — see `app/(caregiver)/_layout.tsx`), the `href: null` / `href: undefined` pattern for dynamically hiding a `Tabs.Screen` from the bar while keeping it a valid route (confirmed current against Expo Router's own docs), Zustand (`useActiveProfileStore`), NativeWind, Jest + React Native Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-17-bottom-tab-navigation-design.md`

## Global Constraints

- Every new/changed `.tsx`/`.ts` file follows `mobile/docs/conventions.md`: named exports (except `app/` route files, which keep `export default`), `interface XProps` above the component, `@/*` import alias, `Ionicons` for icons (never another icon set), no raw `<Text>` (use `src/shared/ui/Typography.tsx`), safe area via `useSafeAreaInsets()` (never hardcoded padding).
- Design tokens: use the existing Tailwind color scale (`petrol/amber/vinculo/neutral-*`) via `className`; a hex value is only needed where a component (e.g. `Ionicons`) doesn't accept `className` — see `mobile/docs/conventions.md` "Design tokens em código".
- Tests: co-located next to the file they test (including inside `app/` — `metro.config.js`'s `resolver.blockList` already excludes `.test.tsx` from the native bundle); use `await render(...)` and `await fireEvent.press/changeText(...)` (missing `await` = silently-passing broken test); run via `npm test`, not raw `npx jest`.
- Run `npm test`, `npm run lint`, `npm run typecheck` after every task — all three must be clean before moving to the next task.
- Don't commit unless the user has explicitly asked for a commit in this session (do not run `git commit` as part of executing this plan — leave that decision to the human).

---

### Task 1: Promote the per-profile icon-color map into `profileTheme.ts`

`ProfileSwitcherDropdown.tsx` already has a local `Record<ProfileType, string>` mapping each profile to its `-700` hex shade (needed because `Ionicons`' `color` prop doesn't accept Tailwind classes). The new tab bar needs the exact same mapping. Promote it to `profileTheme.ts` (the documented single source of truth for profile→color/icon/label) instead of creating a second copy.

**Files:**
- Modify: `mobile/src/features/auth/theme/profileTheme.ts`
- Modify: `mobile/src/features/auth/theme/profileTheme.test.ts`
- Modify: `mobile/src/features/home/components/ProfileSwitcherDropdown.tsx`

**Interfaces:**
- Produces: `getProfileIconColorHex(type: ProfileType): string` from `@/features/auth/theme/profileTheme`, returning `'#123D36'` for `caregiver`, `'#A9721F'` for `cared_person`, `'#A8455F'` for `family`.

- [ ] **Step 1: Write the failing test**

Add to the bottom of `mobile/src/features/auth/theme/profileTheme.test.ts`:

```ts
import { getProfileIconColorHex, getProfileTheme, PROFILE_ORDER, parseProfileType } from './profileTheme';
```

(replace the existing top import line with this one, adding `getProfileIconColorHex`), then add a new `describe` block at the end of the file:

```ts
describe('getProfileIconColorHex', () => {
  it('returns the -700 hex shade for each profile type', () => {
    expect(getProfileIconColorHex('caregiver')).toBe('#123D36');
    expect(getProfileIconColorHex('cared_person')).toBe('#A9721F');
    expect(getProfileIconColorHex('family')).toBe('#A8455F');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- profileTheme.test.ts`
Expected: FAIL — `getProfileIconColorHex is not a function` (or a TypeScript error if `npm test` type-checks; either way it must not pass).

- [ ] **Step 3: Write minimal implementation**

In `mobile/src/features/auth/theme/profileTheme.ts`, add after the `BUTTON_TONE`/`getProfileButtonTone` block (before `parseProfileType`):

```ts
const ICON_COLOR_HEX: Record<ProfileType, string> = {
  caregiver: '#123D36',
  cared_person: '#A9721F',
  family: '#A8455F',
};

// Ionicons' `color` prop needs a real hex value, not a Tailwind class — this
// mirrors each theme's -700 shade for that one spot.
export function getProfileIconColorHex(type: ProfileType): string {
  return ICON_COLOR_HEX[type];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- profileTheme.test.ts`
Expected: PASS, all tests in the file green.

- [ ] **Step 5: Replace the local copy in `ProfileSwitcherDropdown.tsx`**

In `mobile/src/features/home/components/ProfileSwitcherDropdown.tsx`:

Replace:
```ts
import { getProfileTheme, type ProfileTheme } from '@/features/auth/theme/profileTheme';
import { elevation } from '@/shared/ui/theme';
import { Caption } from '@/shared/ui/Typography';

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Icon-in-circle needs a real color value (Ionicons doesn't read NativeWind
// classes), so each theme's -700 shade is mirrored here as a hex constant.
const ICON_COLOR: Record<ProfileTheme['type'], string> = {
  caregiver: '#123D36',
  cared_person: '#A9721F',
  family: '#A8455F',
};

const NEUTRAL_ICON_COLOR = '#5C6B67';
```

With:
```ts
import { getProfileIconColorHex, getProfileTheme } from '@/features/auth/theme/profileTheme';
import { elevation } from '@/shared/ui/theme';
import { Caption } from '@/shared/ui/Typography';

interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

const NEUTRAL_ICON_COLOR = '#5C6B67';
```

Then replace every `ICON_COLOR[activeTheme.type]` with `getProfileIconColorHex(activeTheme.type)` (1 occurrence) and every `ICON_COLOR[theme.type]` with `getProfileIconColorHex(theme.type)` (2 occurrences, inside the `MOCK_LINKED_PROFILES.map`).

- [ ] **Step 6: Run the full suite to verify nothing broke**

Run: `npm test`
Expected: all suites pass (including `ProfileSwitcherDropdown.test.tsx`, unchanged behavior — only the color source moved).

Run: `npm run lint && npm run typecheck`
Expected: both clean.

- [ ] **Step 7: Commit**

```bash
git add mobile/src/features/auth/theme/profileTheme.ts mobile/src/features/auth/theme/profileTheme.test.ts mobile/src/features/home/components/ProfileSwitcherDropdown.tsx
git commit -m "refactor: move per-profile icon color hex into profileTheme.ts"
```

---

### Task 2: `isTabVisible` — pure tab-visibility predicate

The tab bar's per-profile visibility rule (spec section "Abas por perfil") needs to be unit-testable without rendering a full `Tabs` navigator — same pattern the codebase already uses for `canAccessProfileRoute` (a pure function) feeding `useProfileGuard` (an untested hook that just calls it in a `useEffect`).

**Files:**
- Create: `mobile/src/features/navigation/getVisibleTabs.ts`
- Test: `mobile/src/features/navigation/getVisibleTabs.test.ts`

**Interfaces:**
- Produces: `type TabName = 'home' | 'perfil' | 'buscar' | 'agenda' | 'chat'` and `isTabVisible(tab: TabName, activeType: ProfileType | null): boolean`, both from `@/features/navigation/getVisibleTabs`. `ProfileType` comes from `@/features/auth/store/useActiveProfileStore` (already exists).

- [ ] **Step 1: Write the failing test**

Create `mobile/src/features/navigation/getVisibleTabs.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- getVisibleTabs.test.ts`
Expected: FAIL — `Cannot find module './getVisibleTabs'`.

- [ ] **Step 3: Write minimal implementation**

Create `mobile/src/features/navigation/getVisibleTabs.ts`:

```ts
import type { ProfileType } from '@/features/auth/store/useActiveProfileStore';

export type TabName = 'home' | 'perfil' | 'buscar' | 'agenda' | 'chat';

export function isTabVisible(tab: TabName, activeType: ProfileType | null): boolean {
  switch (tab) {
    case 'home':
      return true;
    case 'perfil':
      return activeType === 'caregiver';
    case 'buscar':
      return activeType === 'family' || activeType === 'cared_person';
    case 'agenda':
    case 'chat':
      return activeType !== null;
    default:
      return false;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- getVisibleTabs.test.ts`
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add mobile/src/features/navigation/getVisibleTabs.ts mobile/src/features/navigation/getVisibleTabs.test.ts
git commit -m "feat: add isTabVisible predicate for the per-profile tab bar"
```

---

### Task 3: `TabBarIcon` — active-pill tab icon+label

Presentational component rendering an `Ionicons` icon and a label together, with a colored pill background when `focused`. No dedicated test — it's a pure prop-driven visual component with no branching logic beyond `focused` (same category as `OngoingCareCard`/`MedicationsCard`/etc., which the project's own convention leaves to visual verification instead of a snapshot/unit test; see `mobile/docs/features/home.md` "Testes").

**Files:**
- Create: `mobile/src/features/navigation/components/TabBarIcon.tsx`

**Interfaces:**
- Consumes: nothing new (plain props).
- Produces: `TabBarIcon` component from `@/features/navigation/components/TabBarIcon`, props `{ focused: boolean; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap; label: string; activeBgClass: string; activeTextClass: string; activeColorHex: string }`.

- [ ] **Step 1: Write the component**

Create `mobile/src/features/navigation/components/TabBarIcon.tsx`:

```tsx
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Caption } from '@/shared/ui/Typography';

interface TabBarIconProps {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  activeBgClass: string;
  activeTextClass: string;
  activeColorHex: string;
}

const INACTIVE_COLOR = '#8B8880';

export function TabBarIcon({
  focused,
  icon,
  activeIcon,
  label,
  activeBgClass,
  activeTextClass,
  activeColorHex,
}: TabBarIconProps) {
  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-pill px-3 py-1.5 ${focused ? activeBgClass : ''}`}
    >
      <Ionicons name={focused ? activeIcon : icon} size={18} color={focused ? activeColorHex : INACTIVE_COLOR} />
      <Caption className={`font-body-medium ${focused ? activeTextClass : 'text-neutral-500'}`}>
        {label}
      </Caption>
    </View>
  );
}
```

- [ ] **Step 2: Run lint/typecheck**

Run: `npm run lint && npm run typecheck`
Expected: both clean (this file introduces no tests, so `npm test` output is unchanged from Task 2).

- [ ] **Step 3: Commit**

```bash
git add mobile/src/features/navigation/components/TabBarIcon.tsx
git commit -m "feat: add TabBarIcon, the pill-highlighted tab bar icon+label"
```

---

### Task 4: `useSessionGuard` — session-only route guard

The new tab group needs a guard that only checks for a session (not a specific profile type — the tab list itself handles that). Mirrors `useProfileGuard.ts`'s shape exactly, minus the profile-type check. No dedicated test, matching the existing precedent: `useProfileGuard.ts` itself has no test file either (it's a thin `useEffect` wrapper; the pure logic it would otherwise contain is what `canAccessProfileRoute.test.ts` already covers for the profile-type case — here there's no separate pure function to extract, the check is a one-line `!session`).

**Files:**
- Create: `mobile/src/features/auth/guards/useSessionGuard.ts`

**Interfaces:**
- Consumes: `useAuth()` from `@/app-providers/AuthProvider` (existing, returns `{ session, isLoading, signIn, signOut }`).
- Produces: `useSessionGuard(): void` from `@/features/auth/guards/useSessionGuard`.

- [ ] **Step 1: Write the hook**

Create `mobile/src/features/auth/guards/useSessionGuard.ts`:

```ts
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app-providers/AuthProvider';

export function useSessionGuard(): void {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!session) {
      router.replace('/(auth)');
    }
  }, [isLoading, session]);
}
```

- [ ] **Step 2: Run lint/typecheck**

Run: `npm run lint && npm run typecheck`
Expected: both clean.

- [ ] **Step 3: Commit**

```bash
git add mobile/src/features/auth/guards/useSessionGuard.ts
git commit -m "feat: add useSessionGuard for the shared tab group"
```

---

### Task 5: Move Home into `(tabs)/home.tsx`, drop the "Ver meu perfil público" CTA

Home's adaptive content is unchanged. Only two things change: its file location, and the caregiver-mode CTA that pushed to `/(caregiver)` — now redundant because "Perfil" is a tab, reachable directly from the bar. `login.tsx`/`signup.tsx` (and their tests) are updated to redirect to the new path.

**Files:**
- Create: `mobile/app/(shared)/(tabs)/home.tsx`
- Create: `mobile/app/(shared)/(tabs)/home.test.tsx`
- Delete: `mobile/app/(shared)/home.tsx`
- Delete: `mobile/app/(shared)/home.test.tsx`
- Modify: `mobile/app/(auth)/login.tsx`
- Modify: `mobile/app/(auth)/login.test.tsx`
- Modify: `mobile/app/(auth)/signup.tsx`
- Modify: `mobile/app/(auth)/signup.test.tsx`

**Interfaces:**
- Consumes: everything Home already consumes (`useActiveProfileStore`, `HomeHeader`, `ProfileSwitcherDropdown`, the 5 home cards, `mockData.ts`) — unchanged.

- [ ] **Step 1: Write the new Home test file (RED for the removed CTA, unchanged for the rest)**

Create `mobile/app/(shared)/(tabs)/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react-native';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import Home from './home';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Home', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('mostra o atendimento em andamento e esconde o CTA de cuidador no modo Cuidador', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText('Atendimento em andamento')).toBeTruthy();
    expect(screen.queryByText('Quero ser cuidador')).toBeNull();
  });

  it('não mostra mais o link de perfil público (agora é uma aba)', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Home />);

    expect(screen.queryByText('Ver meu perfil público')).toBeNull();
  });

  it('mostra os remédios de hoje sem a legenda "Cuidando de" no modo Pessoa cuidada', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'cared_person', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText('Remédios de hoje')).toBeTruthy();
    expect(screen.queryByText(/Cuidando de:/)).toBeNull();
  });

  it('mostra a legenda "Cuidando de" no modo Responsável', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<Home />);

    expect(screen.getByText(/Cuidando de:/)).toBeTruthy();
  });

  it('mostra o estado vazio quando nenhum perfil está ativo', async () => {
    await render(<Home />);

    expect(screen.getByText('Escolha um modo acima para ver sua Home.')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- "app/(shared)/(tabs)/home.test.tsx"` (escape the parens for your shell, e.g. `npm test -- 'app/\(shared\)/\(tabs\)/home.test.tsx'`)
Expected: FAIL — `Cannot find module './home'` (the file doesn't exist at this path yet).

- [ ] **Step 3: Create the Home screen at the new path, without the CTA**

Create `mobile/app/(shared)/(tabs)/home.tsx`:

```tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui/Button';
import { Body, Caption } from '@/shared/ui/Typography';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { MedicationsCard } from '@/features/home/components/MedicationsCard';
import { OngoingCareCard } from '@/features/home/components/OngoingCareCard';
import { ProfileSwitcherDropdown } from '@/features/home/components/ProfileSwitcherDropdown';
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
      <ProfileSwitcherDropdown />

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
            <Caption className="font-body-medium">Cuidando de: {MOCK_CARED_PERSON_NAME}</Caption>
          ) : null}
          <MedicationsCard medications={MOCK_MEDICATIONS} />
          <VitalSignsCard {...MOCK_VITAL_SIGNS} />
          <UpcomingAppointmentCard {...MOCK_APPOINTMENT} />
        </View>
      ) : null}

      {!activeProfile ? (
        <View className="items-center gap-3 rounded-md border border-dashed border-neutral-300 bg-white p-6">
          <Ionicons name="hand-left-outline" size={28} color="#8B8880" />
          <Body className="text-center">Escolha um modo acima para ver sua Home.</Body>
        </View>
      ) : null}

      {activeProfile?.type !== 'caregiver' ? (
        <View className="gap-3 border-t border-neutral-100 pt-6">
          <Body className="text-neutral-500">
            Quer prestar cuidado profissional? Ative um perfil de Cuidador na mesma conta.
          </Body>
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

(Same as before, minus the `<Button label="Ver meu perfil público" .../>` block that used to sit right after `TodaysTasksCard`.)

- [ ] **Step 4: Delete the old Home files**

```bash
rm "mobile/app/(shared)/home.tsx" "mobile/app/(shared)/home.test.tsx"
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- 'app/\(shared\)/\(tabs\)/home.test.tsx'`
Expected: PASS, all 5 tests green.

- [ ] **Step 6: Update `login.tsx` and `signup.tsx` to redirect to the new Home path**

In `mobile/app/(auth)/login.tsx`, replace:
```ts
    router.replace('/(shared)/home');
```
with:
```ts
    router.replace('/(shared)/(tabs)/home');
```

In `mobile/app/(auth)/signup.tsx`, replace the same line the same way.

- [ ] **Step 7: Update the matching assertions in `login.test.tsx` and `signup.test.tsx`**

In `mobile/app/(auth)/login.test.tsx`, replace:
```ts
    expect(router.replace).toHaveBeenCalledWith('/(shared)/home');
```
with:
```ts
    expect(router.replace).toHaveBeenCalledWith('/(shared)/(tabs)/home');
```

Do the identical replacement in `mobile/app/(auth)/signup.test.tsx`.

- [ ] **Step 8: Run the full suite to verify nothing broke**

Run: `npm test`
Expected: all suites pass. (`(caregiver)/index.test.tsx` will still exist and still pass at this point — it's removed in Task 6.)

Run: `npm run lint && npm run typecheck`
Expected: both clean.

- [ ] **Step 9: Commit**

```bash
git add "mobile/app/(shared)/(tabs)/home.tsx" "mobile/app/(shared)/(tabs)/home.test.tsx" mobile/app/(auth)/login.tsx mobile/app/(auth)/login.test.tsx mobile/app/(auth)/signup.tsx mobile/app/(auth)/signup.test.tsx
git rm "mobile/app/(shared)/home.tsx" "mobile/app/(shared)/home.test.tsx"
git commit -m "feat: move Home into (shared)/(tabs), drop the perfil-público CTA"
```

---

### Task 6: Move the caregiver profile into `(tabs)/perfil.tsx`, drop the back button, delete `(caregiver)`

As a tab, "Perfil" is a root destination, not something pushed onto a stack — the `chevron-back` + `router.back()` header from `(caregiver)/index.tsx` no longer makes sense and is removed, leaving just the `<H3>Perfil</H3>` title. No test file is created for the new location — the removed back-button test was the only behavior worth testing here, and the rest is presentational composition of already-tested components (`ProfileHeaderCard`, `AboutSection`, `ReviewsList`), matching the same "no dedicated test for composed presentational screens" precedent as Task 3.

**Files:**
- Create: `mobile/app/(shared)/(tabs)/perfil.tsx`
- Delete: `mobile/app/(caregiver)/_layout.tsx`
- Delete: `mobile/app/(caregiver)/index.tsx`
- Delete: `mobile/app/(caregiver)/index.test.tsx`

**Interfaces:**
- Consumes: `ProfileHeaderCard`, `AboutSection`, `ReviewsList`, `MOCK_CAREGIVER_PROFILE`, `MOCK_REVIEWS` from `@/features/caregiver-profile/*` — unchanged.

- [ ] **Step 1: Create the new Perfil screen**

Create `mobile/app/(shared)/(tabs)/perfil.tsx`:

```tsx
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AboutSection } from '@/features/caregiver-profile/components/AboutSection';
import { ProfileHeaderCard } from '@/features/caregiver-profile/components/ProfileHeaderCard';
import { ReviewsList } from '@/features/caregiver-profile/components/ReviewsList';
import { MOCK_CAREGIVER_PROFILE, MOCK_REVIEWS } from '@/features/caregiver-profile/mockCaregiverProfile';
import { H3 } from '@/shared/ui/Typography';

export default function Perfil() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-0" style={{ paddingTop: insets.top }}>
      <View className="border-b border-neutral-100 px-4 py-3">
        <H3>Perfil</H3>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <ProfileHeaderCard
          name={MOCK_CAREGIVER_PROFILE.name}
          initials={MOCK_CAREGIVER_PROFILE.initials}
          verified={MOCK_CAREGIVER_PROFILE.verified}
          topRated={MOCK_CAREGIVER_PROFILE.topRated}
          rating={MOCK_CAREGIVER_PROFILE.rating}
          reviewCount={MOCK_CAREGIVER_PROFILE.reviewCount}
        />
        <AboutSection
          bio={MOCK_CAREGIVER_PROFILE.bio}
          specialties={MOCK_CAREGIVER_PROFILE.specialties}
          experienceYears={MOCK_CAREGIVER_PROFILE.experienceYears}
          region={MOCK_CAREGIVER_PROFILE.region}
          availability={MOCK_CAREGIVER_PROFILE.availability}
          rate={MOCK_CAREGIVER_PROFILE.rate}
        />
        <ReviewsList reviews={MOCK_REVIEWS} />
      </ScrollView>
    </View>
  );
}
```

- [ ] **Step 2: Delete the old `(caregiver)` route group**

```bash
rm -rf "mobile/app/(caregiver)"
```

- [ ] **Step 3: Run the full suite, lint, typecheck**

Run: `npm test`
Expected: all suites pass (the deleted `(caregiver)/index.test.tsx` is simply gone, not failing).

Run: `npm run lint && npm run typecheck`
Expected: both clean — this also confirms nothing else still imports from `app/(caregiver)/*`.

- [ ] **Step 4: Commit**

```bash
git add "mobile/app/(shared)/(tabs)/perfil.tsx"
git rm -r "mobile/app/(caregiver)"
git commit -m "feat: move caregiver public profile into (tabs)/perfil, drop the back button"
```

---

### Task 7: `buscar.tsx` + `chat.tsx` placeholders, delete `(family)`

Both are new placeholder screens (same shape as the `(family)/index.tsx` placeholder they replace) — no content logic, so no dedicated tests, matching the existing placeholder convention (`(shared)/settings.tsx` today has none either).

**Files:**
- Create: `mobile/app/(shared)/(tabs)/buscar.tsx`
- Create: `mobile/app/(shared)/(tabs)/chat.tsx`
- Delete: `mobile/app/(family)/_layout.tsx`
- Delete: `mobile/app/(family)/index.tsx`

- [ ] **Step 1: Create the placeholders**

Create `mobile/app/(shared)/(tabs)/buscar.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function Buscar() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Buscar cuidadores (placeholder)</Text>
    </View>
  );
}
```

Create `mobile/app/(shared)/(tabs)/chat.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function Chat() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Chat (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 2: Delete the old `(family)` route group**

```bash
rm -rf "mobile/app/(family)"
```

- [ ] **Step 3: Run the full suite, lint, typecheck**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all clean.

- [ ] **Step 4: Commit**

```bash
git add "mobile/app/(shared)/(tabs)/buscar.tsx" "mobile/app/(shared)/(tabs)/chat.tsx"
git rm -r "mobile/app/(family)"
git commit -m "feat: add Buscar/Chat tab placeholders, delete the (family) route group"
```

---

### Task 8: `agenda.tsx` — placeholder with profile-aware label

Unlike Buscar/Chat, Agenda's placeholder text genuinely branches on the active profile (spec: "Remédios e agenda" for Família/Pessoa cuidada vs. plain "Agenda" for Cuidador), so it's worth a real TDD cycle.

**Files:**
- Create: `mobile/app/(shared)/(tabs)/agenda.tsx`
- Create: `mobile/app/(shared)/(tabs)/agenda.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `mobile/app/(shared)/(tabs)/agenda.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react-native';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import Agenda from './agenda';

describe('Agenda', () => {
  beforeEach(() => {
    useActiveProfileStore.getState().clearActiveProfile();
  });

  it('mostra "Agenda" no modo Cuidador', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'caregiver', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Agenda (placeholder)')).toBeTruthy();
  });

  it('mostra "Remédios e agenda" no modo Responsável', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'family', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Remédios e agenda (placeholder)')).toBeTruthy();
  });

  it('mostra "Remédios e agenda" no modo Pessoa cuidada', async () => {
    useActiveProfileStore.getState().setActiveProfile({ type: 'cared_person', id: 'preview' });
    await render(<Agenda />);

    expect(screen.getByText('Remédios e agenda (placeholder)')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- 'app/\(shared\)/\(tabs\)/agenda.test.tsx'`
Expected: FAIL — `Cannot find module './agenda'`.

- [ ] **Step 3: Write minimal implementation**

Create `mobile/app/(shared)/(tabs)/agenda.tsx`:

```tsx
import { Text, View } from 'react-native';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';

export default function Agenda() {
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const isFamilyMode = activeProfile?.type === 'family' || activeProfile?.type === 'cared_person';

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">
        {isFamilyMode ? 'Remédios e agenda (placeholder)' : 'Agenda (placeholder)'}
      </Text>
    </View>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- 'app/\(shared\)/\(tabs\)/agenda.test.tsx'`
Expected: PASS, all 3 tests green.

- [ ] **Step 5: Run the full suite, lint, typecheck**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all clean.

- [ ] **Step 6: Commit**

```bash
git add "mobile/app/(shared)/(tabs)/agenda.tsx" "mobile/app/(shared)/(tabs)/agenda.test.tsx"
git commit -m "feat: add Agenda tab placeholder with profile-aware label"
```

---

### Task 9: `(tabs)/_layout.tsx` — wire the navigator together

The final piece: the `Tabs` navigator itself, guarded by `useSessionGuard`, computing which screens are visible (`isTabVisible`) and which color each active tab's pill uses (`getProfileTheme`/`getProfileIconColorHex`) from the current active profile.

**Files:**
- Create: `mobile/app/(shared)/(tabs)/_layout.tsx`

**Interfaces:**
- Consumes: `useSessionGuard` (Task 4), `isTabVisible`/`TabName` (Task 2), `TabBarIcon` (Task 3), `getProfileTheme`/`getProfileIconColorHex` (Task 1, existing), `useActiveProfileStore` (existing).

- [ ] **Step 1: Write the layout**

Create `mobile/app/(shared)/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';
import { useActiveProfileStore } from '@/features/auth/store/useActiveProfileStore';
import { useSessionGuard } from '@/features/auth/guards/useSessionGuard';
import { getProfileIconColorHex, getProfileTheme } from '@/features/auth/theme/profileTheme';
import { TabBarIcon } from '@/features/navigation/components/TabBarIcon';
import { isTabVisible } from '@/features/navigation/getVisibleTabs';

const DEFAULT_TONE = {
  activeBgClass: 'bg-petrol-100',
  activeTextClass: 'text-petrol-700',
  activeColorHex: '#123D36',
};

export default function TabsLayout() {
  useSessionGuard();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);
  const activeType = activeProfile?.type ?? null;

  const tone = activeType
    ? {
        activeBgClass: getProfileTheme(activeType).bgClass100,
        activeTextClass: getProfileTheme(activeType).textClass700,
        activeColorHex: getProfileIconColorHex(activeType),
      }
    : DEFAULT_TONE;

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: isTabVisible('home', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="home-outline" activeIcon="home" label="Home" {...tone} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          href: isTabVisible('perfil', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="person-outline" activeIcon="person" label="Perfil" {...tone} />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          href: isTabVisible('buscar', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="search-outline" activeIcon="search" label="Buscar" {...tone} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          href: isTabVisible('agenda', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="calendar-outline"
              activeIcon="calendar"
              label="Agenda"
              {...tone}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          href: isTabVisible('chat', activeType) ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon="chatbubble-outline"
              activeIcon="chatbubble"
              label="Chat"
              {...tone}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

- [ ] **Step 2: Run the full suite, lint, typecheck**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all clean. (No new test here — this file wires together already-tested pieces; the wiring itself is what Task 10's manual verification confirms end-to-end.)

- [ ] **Step 3: Commit**

```bash
git add "mobile/app/(shared)/(tabs)/_layout.tsx"
git commit -m "feat: add the shared Tabs layout, wiring per-profile tab visibility and color"
```

---

### Task 10: Fix `confirmation.tsx`'s now-dead route strings

`app/(auth)/confirmation.tsx` is currently unreachable from any live screen (see `mobile/docs/features/auth-flow.md`), but it still hardcodes `router.replace('/(caregiver)')` / `'/(family)'` — both routes no longer exist after Task 6/7. Fix now so the screen isn't left pointing at deleted routes (it's kept around specifically to be reusable for a future "activate profile" flow, per `auth-flow.md`).

**Files:**
- Modify: `mobile/app/(auth)/confirmation.tsx`

- [ ] **Step 1: Update the route strings**

In `mobile/app/(auth)/confirmation.tsx`, replace:
```ts
    router.replace(profileType === 'caregiver' ? '/(caregiver)' : '/(family)');
```
with:
```ts
    router.replace(profileType === 'caregiver' ? '/(shared)/(tabs)/perfil' : '/(shared)/(tabs)/buscar');
```

- [ ] **Step 2: Run the full suite, lint, typecheck**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all clean (there's no test file for `confirmation.tsx` today, so this is a lint/typecheck-only check plus manual read-through).

- [ ] **Step 3: Commit**

```bash
git add mobile/app/(auth)/confirmation.tsx
git commit -m "fix: point confirmation.tsx at the new tab routes instead of the deleted ones"
```

---

### Task 11: Documentation

Update every doc that describes the navigation shell or the two screens that moved, per `mobile/CLAUDE.md`'s "Keeping these docs current" rule (fix in the same change that caused the drift).

**Files:**
- Create: `mobile/docs/features/navigation.md`
- Modify: `mobile/docs/architecture.md`
- Modify: `mobile/docs/features/home.md`
- Modify: `mobile/docs/features/caregiver-profile.md`
- Modify: `mobile/docs/requirements.md`
- Modify: `mobile/CLAUDE.md`

- [ ] **Step 1: Create `mobile/docs/features/navigation.md`**

Create `mobile/docs/features/navigation.md`:

```markdown
# Menu inferior (`app/(shared)/(tabs)/`)

Documenta a tab bar persistente pós-login — decisão original em
`docs/superpowers/specs/2026-08-17-bottom-tab-navigation-design.md`, este
arquivo é o registro do que ficou implementado.

## O que é

Um único `Tabs` navigator (`app/(shared)/(tabs)/_layout.tsx`), guardado só
por sessão (`useSessionGuard` — exige `session`, não um tipo de perfil
específico). As abas visíveis mudam conforme o perfil ativo
(`useActiveProfileStore`), decidido pela função pura `isTabVisible` em
`src/features/navigation/getVisibleTabs.ts`:

| Aba | Rota | Cuidador | Família / Pessoa cuidada | Sem perfil ativo |
|---|---|---|---|---|
| Home | `home.tsx` | ✅ | ✅ | ✅ |
| Perfil | `perfil.tsx` | ✅ | — | — |
| Buscar | `buscar.tsx` | — | ✅ | — |
| Agenda | `agenda.tsx` | ✅ | ✅ | — |
| Chat | `chat.tsx` | ✅ | ✅ | — |

Home é a única aba sempre visível — sem perfil ativo, é a única forma de
navegar (o `ProfileSwitcherDropdown` de dentro da Home é quem escolhe um
perfil, e as demais abas aparecem depois disso).

## Visual

Aba ativa: ícone (variante preenchida) + label dentro de uma pill de fundo
na cor do perfil ativo (`getProfileTheme(activeType).bgClass100`/
`.textClass700` + `getProfileIconColorHex(activeType)` pro ícone). Aba
inativa: ícone outline + label em `neutral-500`, sem fundo. A cor muda
dinamicamente com o perfil ativo — não é uma cor fixa de tab bar. Sem
perfil ativo, usa petrol como tom padrão (`DEFAULT_TONE` em `_layout.tsx`).

Implementado via `tabBarShowLabel: false` + `tabBarIcon` retornando
ícone+label juntos (componente `TabBarIcon`,
`src/features/navigation/components/`) — não via `tabBarButton`, que
exigiria importar `BottomTabBarButtonProps` de um caminho profundo interno
do `expo-router` (`expo-router/build/react-navigation/bottom-tabs`, não
reexportado no pacote principal).

## O que é real vs. placeholder

- **Home**: real, inalterada (mesma Home adaptativa de sempre — ver
  `home.md`), só mudou de pasta (`(shared)/home.tsx` →
  `(shared)/(tabs)/home.tsx`).
- **Perfil**: real, migrada de `(caregiver)/index.tsx` (ver
  `caregiver-profile.md`) — perdeu o botão de voltar customizado (não faz
  sentido numa aba raiz).
- **Buscar, Agenda, Chat**: placeholders (`View` + `Text` fixos, mesmo
  padrão de `(shared)/settings.tsx`). Agenda tem uma variação de texto por
  perfil ("Agenda" pro Cuidador, "Remédios e agenda" pra Família/Pessoa
  cuidada) — só o texto, sem lógica além disso.

## O que foi removido

- Grupos de rota `(caregiver)` e `(family)` (cada um era um `Tabs`
  navigator próprio de uma aba só, guardado por tipo de perfil via
  `useProfileGuard` — nenhum dos dois fazia parte do fluxo principal).
- O CTA "Ver meu perfil público" na Home (existia só porque não havia
  outro jeito de chegar no Perfil; a aba resolve isso direto).

## Simplificação conhecida

Nenhuma rota dentro de `(tabs)` guarda por tipo de perfil individualmente
(`perfil.tsx` não checa que o perfil ativo é `caregiver` antes de
renderizar, por exemplo) — a proteção é só "essa aba não aparece pro
perfil errado". Suficiente por enquanto porque não há deep link direto pra
essas rotas ainda. `useProfileGuard`/`canAccessProfileRoute`
(`src/features/auth/guards/`) continuam existindo, sem uso ativo no
momento, prontos pra quando um guard por tipo dentro de uma aba específica
for necessário.

## Testes

- `getVisibleTabs.test.ts` cobre a regra de visibilidade por perfil (os 5
  nomes de aba × os 4 estados de perfil possíveis).
- `home.test.tsx` migrou de pasta, com os 2 testes do CTA removido
  trocados por 1 teste confirmando que o texto não aparece mais.
- `agenda.test.tsx` cobre a troca de texto por perfil.
- `perfil.tsx`, `buscar.tsx`, `chat.tsx` e `_layout.tsx` não têm teste
  dedicado — composição presentacional de peças já testadas, mesmo padrão
  dos cards da Home.
```

- [ ] **Step 2: Update `mobile/docs/architecture.md`**

Find the "Navegação (Expo Router)" section. Replace:
```markdown
- `app/(auth)` — Stack sem header (`_layout.tsx` usa
  `<Stack screenOptions={{ headerShown: false }} />`). Fluxo:
  `index` (splash) → `onboarding` → `signup` → `(shared)/home`.
- `app/(caregiver)` e `app/(family)` — cada um é um `Tabs` navigator próprio,
  guardado por `useProfileGuard`. `(caregiver)` já tem conteúdo real (perfil
  público do cuidador, ver `features/caregiver-profile.md`), alcançável a
  partir da Home no modo Cuidador. `(family)` ainda só tem a rota `index`
  (placeholder — vai virar a busca de cuidadores, RF02/RF11).
- `app/(shared)` — `Stack` simples, sem guard. `home.tsx` é hoje **a** Home
  única do app (independente de perfil) — tem o CTA de teste "Quero ser
  cuidador" que abre `app/(caregiver-onboarding)/intro`.
```
with:
```markdown
- `app/(auth)` — Stack sem header (`_layout.tsx` usa
  `<Stack screenOptions={{ headerShown: false }} />`). Fluxo:
  `index` (splash) → `onboarding` → `signup` → `(shared)/(tabs)/home`.
- `app/(shared)/(tabs)` — um único `Tabs` navigator pós-login, guardado só
  por sessão (`useSessionGuard`, não por tipo de perfil). As abas visíveis
  mudam com o perfil ativo (`isTabVisible`) — ver
  `features/navigation.md`. Home é a única aba sempre visível.
- `app/(shared)` (fora de `(tabs)`) — `Stack` simples, sem guard;
  `settings.tsx` mora aqui, fora da tab bar.
```

Then find "## O que é placeholder vs. real" and replace:
```markdown
- `app/(auth)/*` (splash, onboarding, signup, login) e `app/(shared)/home.tsx`
  — completos, é o caminho principal navegável hoje.
```
with:
```markdown
- `app/(auth)/*` (splash, onboarding, signup, login) e
  `app/(shared)/(tabs)/home.tsx` — completos, é o caminho principal
  navegável hoje.
```

And replace:
```markdown
- `app/(caregiver)/index.tsx` — perfil público do cuidador, real (dados
  mockados) e alcançável a partir da Home no modo Cuidador. Ver
  `features/caregiver-profile.md`.
- `(family)` e `(shared)/settings` ainda são placeholders (`View` + `Text`
  fixos) e **não fazem parte da navegação principal atual** — cada uma vira
  seu próprio ciclo de spec/plano conforme a ordem do roadmap de produto
  (busca, chat, remédios, agenda...).
```
with:
```markdown
- `app/(shared)/(tabs)/perfil.tsx` — perfil público do cuidador, real
  (dados mockados), aba visível só no modo Cuidador. Ver
  `features/caregiver-profile.md`.
- `app/(shared)/(tabs)/buscar.tsx`, `agenda.tsx`, `chat.tsx` e
  `(shared)/settings.tsx` ainda são placeholders (`View` + `Text` fixos) —
  cada um vira seu próprio ciclo de spec/plano conforme a ordem do roadmap
  de produto (busca, chat, remédios, agenda...).
```

- [ ] **Step 3: Update `mobile/docs/features/home.md`**

Replace every remaining reference to `app/(shared)/home.tsx` with
`app/(shared)/(tabs)/home.tsx` (there are several across the file — the
opening paragraph, the "Estrutura" code block's first line, and the
"Testes"/closing sections).

Find:
```markdown
- **`caregiver`**: `OngoingCareCard` + `TodaysTasksCard` + botão "Ver meu
  perfil público" (→ `/(caregiver)`, ver `caregiver-profile.md`).
```
Replace with:
```markdown
- **`caregiver`**: `OngoingCareCard` + `TodaysTasksCard`. (O antigo botão
  "Ver meu perfil público" foi removido — "Perfil" agora é uma aba da tab
  bar, ver `navigation.md`.)
```

Find the sentence about the only real navigation out of Home:
```markdown
Nenhum card navega pra lugar nenhum ao tocar — remédios, sinais vitais e
agenda ainda não têm tela de detalhe (são os próximos itens do roadmap;
ver `docs/product/vision.md`). O botão "Finalizar atendimento" do
`OngoingCareCard` também não tem ação (`onPress={() => {}}`). A única
navegação real que sai da Home hoje é o botão "Ver meu perfil público" no
modo `caregiver` (→ `/(caregiver)`, tela real — ver
`caregiver-profile.md`) e o CTA "Quero ser cuidador" (→
`/(caregiver-onboarding)/intro`).
```
Replace with:
```markdown
Nenhum card navega pra lugar nenhum ao tocar — remédios, sinais vitais e
agenda ainda não têm tela de detalhe (são os próximos itens do roadmap;
ver `docs/product/vision.md`). O botão "Finalizar atendimento" do
`OngoingCareCard` também não tem ação (`onPress={() => {}}`). A única
navegação real que sai da Home hoje é o CTA "Quero ser cuidador" (→
`/(caregiver-onboarding)/intro`) — chegar no Perfil do cuidador agora é
via a aba "Perfil" da tab bar, não um link dentro da Home (ver
`navigation.md`).
```

- [ ] **Step 4: Update `mobile/docs/features/caregiver-profile.md`**

Replace the "Como se chega lá" section:
```markdown
## Como se chega lá

Alcançável a partir da Home (`app/(shared)/home.tsx`), no modo `caregiver`:
botão secundário "Ver meu perfil público" abaixo do `TodaysTasksCard`, que
faz `router.push('/(caregiver)')`. A rota já é acessível porque
`useProfileGuard('caregiver')` (guard do grupo `(caregiver)`) só exige
sessão + perfil ativo `caregiver`, ambos reais desde que login/signup
passaram a chamar `AuthProvider.signIn` (ver `auth-flow.md`) e o
`ProfileSwitcherDropdown` passou a setar o perfil ativo de verdade (ver
`home.md`).
```
with:
```markdown
## Como se chega lá

É a aba "Perfil" da tab bar (`app/(shared)/(tabs)/`), visível só quando o
perfil ativo é `caregiver` — ver `navigation.md` pra regra completa de
visibilidade por perfil. Antes de virar aba, essa tela vivia em
`(caregiver)/index.tsx` e era alcançada por um botão na Home
(`router.push('/(caregiver)')`); esse grupo de rota foi removido quando o
menu inferior substituiu a navegação por push.
```

Replace the "Botão de voltar manual" / "Cabeçalho próprio" paragraph:
```markdown
**Cabeçalho próprio, header nativo desligado:** `(caregiver)` é um `Tabs`
navigator (não `Stack`), então não ganha seta de voltar automática ao ser
aberto por `router.push` a partir de outro grupo de rota — e o header
nativo do `Tabs.Screen` (título "Perfil" sozinho, sem botão de voltar)
só duplicava informação e empurrava o conteúdo pra baixo com um espaço
vazio grande. Por isso `options.headerShown: false` foi setado em
`app/(caregiver)/_layout.tsx` pra essa rota, e a tela monta seu próprio
cabeçalho: uma linha `chevron-back` (botão circular, área de toque 40×40,
`active:bg-neutral-100`) + `<H3>Perfil</H3>`, com borda inferior sutil
(`border-neutral-100`) separando do conteúdo — mesmo padrão de botão de
voltar usado em `app/(caregiver-onboarding)/intro.tsx`, mas em par com um
título em vez de sozinho.
```
with:
```markdown
**Sem botão de voltar.** Existia (`chevron-back` + `router.back()`)
enquanto essa tela era alcançada por push a partir da Home; como aba raiz
da tab bar (ver `navigation.md`), voltar não faz sentido — não há "de
onde voltar". O cabeçalho ficou só `<H3>Perfil</H3>` com uma borda
inferior sutil (`border-neutral-100`) separando do conteúdo. O header
nativo do `Tabs.Screen` continua desligado (`headerShown: false` no
`_layout.tsx` compartilhado), já que quem desenha o cabeçalho é a própria
tela.
```

Remove the line in "## Testes" that references the now-deleted back-button test:
```markdown
- `app/(caregiver)/index.test.tsx` cobre o botão de voltar chamando
  `router.back()`.
```
(delete this bullet entirely — the file, and the behavior, no longer exist).

- [ ] **Step 5: Update `mobile/docs/requirements.md`**

In the "Gaps conhecidos" section, find the RF21/NEG06 paragraph and append
a note that the guard mechanism changed:
```markdown
- **RF21 / NEG06 (redirecionar pra escolha de perfil)** — parcialmente
  fechado. A escolha de perfil não é mais uma tela separada — é o
  **`ProfileSwitcherDropdown` na própria Home**
  (`src/features/home/components/ProfileSwitcherDropdown.tsx`), que lista
  só os perfis vinculados à conta (mockados em
  `src/features/auth/mockLinkedProfiles.ts`, já que ainda não existe uma
  lista real vinda de conta autenticada — ver `features/home.md`).
  **Ainda falta**: `useProfileGuard`
  (`src/features/auth/guards/useProfileGuard.ts`) continua redirecionando
  pra `/(auth)` (a Splash) quando o perfil exigido não existe na conta, em
  vez de `/(shared)/home` — a tela antiga (`profile-choice.tsx`, removida —
  ver `features/auth-flow.md`) nunca foi substituída no guard, só na Home.
```
with:
```markdown
- **RF21 / NEG06 (redirecionar pra escolha de perfil)** — parcialmente
  fechado. A escolha de perfil não é mais uma tela separada — é o
  **`ProfileSwitcherDropdown` na própria Home**
  (`src/features/home/components/ProfileSwitcherDropdown.tsx`), que lista
  só os perfis vinculados à conta (mockados em
  `src/features/auth/mockLinkedProfiles.ts`, já que ainda não existe uma
  lista real vinda de conta autenticada — ver `features/home.md`). O menu
  inferior (`app/(shared)/(tabs)/`, ver `features/navigation.md`)
  reforça isso escondendo abas que não fazem sentido pro perfil ativo.
  **Ainda falta**: `useProfileGuard`
  (`src/features/auth/guards/useProfileGuard.ts`) não é chamado por
  nenhuma rota no momento (o grupo `(tabs)` usa `useSessionGuard`, que só
  checa sessão) — fica em standby pra quando um guard por tipo dentro de
  uma aba específica for necessário.
```

- [ ] **Step 6: Update `mobile/CLAUDE.md`**

Replace:
```markdown
- `docs/features/caregiver-profile.md` — the caregiver's public profile screen (`(caregiver)/index.tsx`), reached from Home's "Ver meu perfil público" button.
```
with:
```markdown
- `docs/features/caregiver-profile.md` — the caregiver's public profile screen (`(shared)/(tabs)/perfil.tsx`), the "Perfil" tab.
- `docs/features/navigation.md` — the bottom tab bar (`(shared)/(tabs)/`), which tabs are visible per active profile, and its active-pill styling.
```

- [ ] **Step 7: Final full verification**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all clean — this is the last task, so this run should reflect the
whole feature end to end (every suite from Tasks 1–10 plus every doc-only
change from this task, which touches no test).

- [ ] **Step 8: Commit**

```bash
git add mobile/docs/features/navigation.md mobile/docs/architecture.md mobile/docs/features/home.md mobile/docs/features/caregiver-profile.md mobile/docs/requirements.md mobile/CLAUDE.md
git commit -m "docs: document the bottom tab navigation and the screens it moved"
```
