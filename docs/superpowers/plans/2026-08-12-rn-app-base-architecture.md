# CuidaMais RN Base Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the CuidaMais Expo/React Native project with the folder
structure, navigation skeleton, multi-profile auth, backend-agnostic data
layer, and tooling defined in the architecture spec — a foundation on which
each product feature (auth/cadastro, busca, chat, remédios, agenda,
avaliações) will be built in later plans.

**Architecture:** Feature-based `src/features/*` folders consumed by thin
`app/` route files (Expo Router). Session auth and active-profile selection
are separate concerns (`AuthProvider` context + Zustand
`useActiveProfileStore`). All network access goes through a single
`src/shared/api/client.ts`, kept swappable since the backend isn't chosen
yet.

**Tech Stack:** Expo (managed, TypeScript), Expo Router, TanStack Query,
Zustand, NativeWind, axios, Jest + React Native Testing Library, ESLint +
Prettier + Husky/lint-staged, EAS Build (dev client).

**Spec:** `docs/superpowers/specs/2026-08-12-rn-app-architecture-design.md`

## Global Constraints

- TypeScript everywhere — no `.js` source files.
- Feature code lives under `src/features/<name>/`; `app/` route files stay
  thin (composition + navigation only), per spec's folder structure.
- All outbound HTTP goes through `src/shared/api/client.ts` — no feature
  calls `axios`/`fetch` directly.
- Tests live next to the code they test (no separate `__tests__` tree).
- Node package manager: npm (repo has no lockfile yet; use `npm` for all
  installs so `package-lock.json` stays authoritative).

---

### Task 1: Scaffold the Expo project

**Files:**
- Create: entire Expo TypeScript template at repo root (`app.json`,
  `package.json`, `tsconfig.json`, `babel.config.js`, `app/` starter
  screens, etc.)
- Create: `src/.gitkeep` (placeholder until Task 4+ populate it)

**Interfaces:**
- Produces: a working `npm start` Expo project at repo root; `tsconfig.json`
  with a `@/*` path alias resolving to `src/*`.

- [ ] **Step 1: Scaffold into a temp subdirectory**

The repo root already has `.git` and `docs/`, so `create-expo-app` can't
target `.` directly (it refuses non-empty directories). Scaffold into a
temp folder, then move the contents up.

```bash
cd /Users/pedrogodri/dev/cuidamais
npx create-expo-app@latest .tmp-scaffold --template blank-typescript
```

- [ ] **Step 2: Move scaffold contents into repo root**

```bash
cd /Users/pedrogodri/dev/cuidamais
shopt -s dotglob
mv .tmp-scaffold/* .
rmdir .tmp-scaffold
shopt -u dotglob
```

- [ ] **Step 3: Add the `@/*` path alias**

Edit `tsconfig.json` so it reads:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 4: Create the `src/` skeleton**

```bash
mkdir -p /Users/pedrogodri/dev/cuidamais/src/features
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/ui
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/api
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/realtime
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/hooks
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/utils
mkdir -p /Users/pedrogodri/dev/cuidamais/src/shared/types
mkdir -p /Users/pedrogodri/dev/cuidamais/src/app-providers
touch /Users/pedrogodri/dev/cuidamais/src/features/.gitkeep
```

- [ ] **Step 5: Verify the app boots**

Run: `npx expo-doctor` then `npx tsc --noEmit`
Expected: both complete with no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "chore: scaffold Expo TypeScript project"
```

---

### Task 2: Lint, format, and test tooling

**Files:**
- Create: `.eslintrc.js`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Create: `jest.config.js`
- Create: `jest-setup.ts`
- Modify: `package.json` (scripts, devDependencies, `lint-staged` config)
- Create: `.husky/pre-commit`
- Test: `src/shared/utils/identity.test.ts` (smoke test proving Jest runs)

**Interfaces:**
- Produces: `npm run lint`, `npm run format`, `npm test` scripts usable by
  every later task.

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx expo install eslint-config-expo --dev
npm install --save-dev prettier eslint-config-prettier \
  jest jest-expo @testing-library/react-native @testing-library/jest-native \
  husky lint-staged @types/jest
```

- [ ] **Step 2: Write ESLint config**

`.eslintrc.js`:

```js
module.exports = {
  extends: ['expo', 'prettier'],
  ignorePatterns: ['/dist/*'],
};
```

- [ ] **Step 3: Write Prettier config**

`.prettierrc`:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

`.prettierignore`:

```
node_modules
.expo
dist
```

- [ ] **Step 4: Write Jest config**

`jest.config.js`:

```js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEach: [],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
};
```

`jest-setup.ts`:

```ts
import '@testing-library/jest-native/extend-expect';
```

- [ ] **Step 5: Add npm scripts**

Edit `package.json` `scripts` to include:

```json
{
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "test": "jest",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 6: Write the Jest smoke test**

`src/shared/utils/identity.ts`:

```ts
export function identity<T>(value: T): T {
  return value;
}
```

`src/shared/utils/identity.test.ts`:

```ts
import { identity } from './identity';

describe('identity', () => {
  it('returns the value unchanged', () => {
    expect(identity(42)).toBe(42);
  });
});
```

- [ ] **Step 7: Run the test suite**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 8: Wire up Husky + lint-staged**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx husky init
```

Replace the generated `.husky/pre-commit` with:

```bash
npx lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

- [ ] **Step 9: Verify lint passes**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 10: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "chore: add lint, format, and test tooling"
```

---

### Task 3: NativeWind styling

**Files:**
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `nativewind-env.d.ts`
- Modify: `babel.config.js`
- Modify: `metro.config.js` (create if template didn't emit one)
- Create: `src/shared/ui/Button.tsx`
- Test: `src/shared/ui/Button.test.tsx`

**Interfaces:**
- Produces: `<Button>` component in `src/shared/ui/Button.tsx`, exported as
  named export `Button`, proving NativeWind classes render.

- [ ] **Step 1: Install NativeWind**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx expo install nativewind tailwindcss@^3
```

- [ ] **Step 2: Configure Tailwind**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx tailwindcss init
```

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

`global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`nativewind-env.d.ts`:

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 3: Wire up Babel and Metro**

`babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

Create `metro.config.js` if it doesn't already exist:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] **Step 4: Write the failing test**

`src/shared/ui/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('renders the given label', () => {
    render(<Button label="Entrar" onPress={() => {}} />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- Button`
Expected: FAIL — `./Button` module not found.

- [ ] **Step 6: Implement the component**

`src/shared/ui/Button.tsx`:

```tsx
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-lg bg-blue-600 px-4 py-3 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- Button`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add NativeWind styling and base Button component"
```

---

### Task 4: Expo Router navigation skeleton

**Files:**
- Modify: `app/_layout.tsx`
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/index.tsx`
- Create: `app/(caregiver)/_layout.tsx`
- Create: `app/(caregiver)/index.tsx`
- Create: `app/(family)/_layout.tsx`
- Create: `app/(family)/index.tsx`
- Create: `app/(shared)/_layout.tsx`
- Create: `app/(shared)/settings.tsx`
- Remove: template starter screens left over from `create-expo-app` (e.g.
  `app/index.tsx`, `app/(tabs)/*` if the blank-typescript template created
  any beyond `app/_layout.tsx`)

**Interfaces:**
- Produces: four route groups — `(auth)`, `(caregiver)`, `(family)`,
  `(shared)` — each with its own layout, matching the spec's navigation
  section. No auth guard yet (Task 8 adds it).

- [ ] **Step 1: Clean up template starter routes**

```bash
cd /Users/pedrogodri/dev/cuidamais
ls app/
```

Remove any starter screens other than `app/_layout.tsx` (e.g. delete
`app/index.tsx` or `app/(tabs)/` if present) so the four route groups below
are the only routes.

- [ ] **Step 2: Root layout**

`app/_layout.tsx`:

```tsx
import '../global.css';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return <Slot />;
}
```

- [ ] **Step 3: Auth group**

`app/(auth)/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

`app/(auth)/index.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function AuthEntry() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Login / cadastro (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 4: Caregiver group**

`app/(caregiver)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';

export default function CaregiverLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
```

`app/(caregiver)/index.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function CaregiverHome() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Área do cuidador (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 5: Family group**

`app/(family)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';

export default function FamilyLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Buscar' }} />
    </Tabs>
  );
}
```

`app/(family)/index.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function FamilyHome() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Área da família (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 6: Shared group**

`app/(shared)/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function SharedLayout() {
  return <Stack />;
}
```

`app/(shared)/settings.tsx`:

```tsx
import { Text, View } from 'react-native';

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Configurações (placeholder)</Text>
    </View>
  );
}
```

- [ ] **Step 7: Verify the app boots and routes resolve**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npx expo start` (manually navigate to `/(auth)`, `/(caregiver)`,
`/(family)`, `/(shared)/settings` in Expo Go or the dev client)
Expected: each route renders its placeholder screen without crashing.

- [ ] **Step 8: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add Expo Router route groups for auth, caregiver, family, shared"
```

---

### Task 5: Shared API client

**Files:**
- Create: `src/shared/api/errors.ts`
- Create: `src/shared/api/client.ts`
- Test: `src/shared/api/errors.test.ts`
- Test: `src/shared/api/client.test.ts`

**Interfaces:**
- Produces:
  - `class ApiError extends Error { status: number | null; code: string | null }`
  - `function normalizeApiError(error: unknown): ApiError`
  - `function attachAuthHeader(config: InternalAxiosRequestConfig, getToken: () => string | null): InternalAxiosRequestConfig`
  - `function createApiClient(options: { baseURL: string; getToken: () => string | null }): AxiosInstance`
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Install axios**

```bash
cd /Users/pedrogodri/dev/cuidamais
npm install axios
```

- [ ] **Step 2: Write the failing error-normalization test**

`src/shared/api/errors.test.ts`:

```ts
import { AxiosError } from 'axios';
import { ApiError, normalizeApiError } from './errors';

describe('normalizeApiError', () => {
  it('extracts status and code from an axios error with a response', () => {
    const axiosError = new AxiosError('Request failed', undefined, undefined, undefined, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {} as never,
      data: { code: 'NOT_FOUND', message: 'Recurso não encontrado' },
    });

    const result = normalizeApiError(axiosError);

    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(404);
    expect(result.code).toBe('NOT_FOUND');
    expect(result.message).toBe('Recurso não encontrado');
  });

  it('falls back to a generic error when there is no response (network failure)', () => {
    const axiosError = new AxiosError('Network Error');

    const result = normalizeApiError(axiosError);

    expect(result.status).toBeNull();
    expect(result.code).toBeNull();
    expect(result.message).toBe('Network Error');
  });

  it('wraps non-axios errors as a generic ApiError', () => {
    const result = normalizeApiError(new Error('boom'));

    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBeNull();
    expect(result.message).toBe('boom');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- errors`
Expected: FAIL — `./errors` module not found.

- [ ] **Step 4: Implement error normalization**

`src/shared/api/errors.ts`:

```ts
import { AxiosError } from 'axios';

export class ApiError extends Error {
  status: number | null;
  code: string | null;

  constructor(message: string, status: number | null = null, code: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ApiErrorBody {
  code?: string;
  message?: string;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return new ApiError(
      body?.message ?? error.message,
      error.response?.status ?? null,
      body?.code ?? null,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Unknown error');
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- errors`
Expected: PASS

- [ ] **Step 6: Write the failing auth-header test**

`src/shared/api/client.test.ts`:

```ts
import type { InternalAxiosRequestConfig } from 'axios';
import { attachAuthHeader, createApiClient } from './client';

describe('attachAuthHeader', () => {
  it('adds an Authorization header when a token is available', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachAuthHeader(config, () => 'abc123');

    expect(result.headers.Authorization).toBe('Bearer abc123');
  });

  it('leaves headers untouched when there is no token', () => {
    const config = { headers: {} } as InternalAxiosRequestConfig;

    const result = attachAuthHeader(config, () => null);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

describe('createApiClient', () => {
  it('creates an axios instance with the given base URL', () => {
    const client = createApiClient({ baseURL: 'https://api.example.com', getToken: () => null });

    expect(client.defaults.baseURL).toBe('https://api.example.com');
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm test -- client`
Expected: FAIL — `./client` module not found.

- [ ] **Step 8: Implement the client**

`src/shared/api/client.ts`:

```ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { normalizeApiError } from './errors';

export function attachAuthHeader(
  config: InternalAxiosRequestConfig,
  getToken: () => string | null,
): InternalAxiosRequestConfig {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

interface CreateApiClientOptions {
  baseURL: string;
  getToken: () => string | null;
}

export function createApiClient({ baseURL, getToken }: CreateApiClientOptions): AxiosInstance {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => attachAuthHeader(config, getToken));

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error)),
  );

  return instance;
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npm test -- client`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add backend-agnostic API client with error normalization"
```

---

### Task 6: Active profile store (Zustand)

**Files:**
- Create: `src/features/auth/store/useActiveProfileStore.ts`
- Test: `src/features/auth/store/useActiveProfileStore.test.ts`

**Interfaces:**
- Produces:
  - `type ProfileType = 'caregiver' | 'family' | 'cared_person'`
  - `interface ActiveProfile { type: ProfileType; id: string }`
  - `useActiveProfileStore` — Zustand hook exposing `{ activeProfile: ActiveProfile | null; setActiveProfile: (profile: ActiveProfile) => void; clearActiveProfile: () => void }`
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Install Zustand**

```bash
cd /Users/pedrogodri/dev/cuidamais
npm install zustand
```

- [ ] **Step 2: Write the failing test**

`src/features/auth/store/useActiveProfileStore.test.ts`:

```ts
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- useActiveProfileStore`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement the store**

`src/features/auth/store/useActiveProfileStore.ts`:

```ts
import { create } from 'zustand';

export type ProfileType = 'caregiver' | 'family' | 'cared_person';

export interface ActiveProfile {
  type: ProfileType;
  id: string;
}

interface ActiveProfileState {
  activeProfile: ActiveProfile | null;
  setActiveProfile: (profile: ActiveProfile) => void;
  clearActiveProfile: () => void;
}

export const useActiveProfileStore = create<ActiveProfileState>((set) => ({
  activeProfile: null,
  setActiveProfile: (profile) => set({ activeProfile: profile }),
  clearActiveProfile: () => set({ activeProfile: null }),
}));
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- useActiveProfileStore`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add active profile Zustand store"
```

---

### Task 7: Auth session provider

**Files:**
- Create: `src/app-providers/AuthProvider.tsx`
- Test: `src/app-providers/AuthProvider.test.tsx`

**Interfaces:**
- Produces:
  - `interface AuthSession { token: string }`
  - `AuthProvider` — React component accepting `children`
  - `useAuth()` — hook returning
    `{ session: AuthSession | null; isLoading: boolean; signIn: (session: AuthSession) => Promise<void>; signOut: () => Promise<void> }`
- Consumes: nothing from earlier tasks (Task 5's `createApiClient` will
  consume `useAuth`'s `session.token` in a later, feature-level plan — not
  wired here to keep this task self-contained).

- [ ] **Step 1: Install SecureStore**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx expo install expo-secure-store
```

- [ ] **Step 2: Write the failing test**

`src/app-providers/AuthProvider.test.tsx`:

```tsx
import * as SecureStore from 'expo-secure-store';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthProvider';

jest.mock('expo-secure-store');

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
  });

  it('starts with no session and isLoading true, then false once checked', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it('signIn stores the token and updates session', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({ token: 'tok-123' });
    });

    expect(result.current.session).toEqual({ token: 'tok-123' });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'tok-123');
  });

  it('signOut clears the stored token and session', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signIn({ token: 'tok-123' });
    });
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.session).toBeNull();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- AuthProvider`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement the provider**

`src/app-providers/AuthProvider.tsx`:

```tsx
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const TOKEN_KEY = 'auth_token';

export interface AuthSession {
  token: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then((token) => {
      setSession(token ? { token } : null);
      setIsLoading(false);
    });
  }, []);

  async function signIn(newSession: AuthSession) {
    await SecureStore.setItemAsync(TOKEN_KEY, newSession.token);
    setSession(newSession);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- AuthProvider`
Expected: PASS

- [ ] **Step 6: Wire providers into the root layout**

Modify `app/_layout.tsx`:

```tsx
import '../global.css';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/app-providers/AuthProvider';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

```bash
cd /Users/pedrogodri/dev/cuidamais
npm install @tanstack/react-query
```

- [ ] **Step 7: Verify everything still typechecks and boots**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 8: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add AuthProvider and wire TanStack Query + Auth into root layout"
```

---

### Task 8: Profile route guard

**Files:**
- Create: `src/features/auth/guards/canAccessProfileRoute.ts`
- Create: `src/features/auth/guards/useProfileGuard.ts`
- Test: `src/features/auth/guards/canAccessProfileRoute.test.ts`
- Modify: `app/(caregiver)/_layout.tsx`
- Modify: `app/(family)/_layout.tsx`

**Interfaces:**
- Consumes: `AuthSession` type and `useAuth()` from Task 7
  (`@/app-providers/AuthProvider`); `ActiveProfile`, `ProfileType`, and
  `useActiveProfileStore` from Task 6
  (`@/features/auth/store/useActiveProfileStore`).
- Produces:
  - `function canAccessProfileRoute(session: AuthSession | null, activeProfile: ActiveProfile | null, requiredType: ProfileType): boolean`
  - `useProfileGuard(requiredType: ProfileType)` — hook with no return value;
    redirects to `/(auth)` via `expo-router`'s `router.replace` as a side
    effect when `canAccessProfileRoute` is `false` and auth has finished
    loading.

- [ ] **Step 1: Write the failing test for the pure guard logic**

`src/features/auth/guards/canAccessProfileRoute.test.ts`:

```ts
import { canAccessProfileRoute } from './canAccessProfileRoute';

describe('canAccessProfileRoute', () => {
  it('denies access when there is no session', () => {
    expect(canAccessProfileRoute(null, { type: 'caregiver', id: 'p1' }, 'caregiver')).toBe(false);
  });

  it('denies access when there is no active profile', () => {
    expect(canAccessProfileRoute({ token: 't' }, null, 'caregiver')).toBe(false);
  });

  it('denies access when the active profile type does not match', () => {
    expect(
      canAccessProfileRoute({ token: 't' }, { type: 'family', id: 'p1' }, 'caregiver'),
    ).toBe(false);
  });

  it('allows access when session and matching active profile are present', () => {
    expect(
      canAccessProfileRoute({ token: 't' }, { type: 'caregiver', id: 'p1' }, 'caregiver'),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- canAccessProfileRoute`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the pure guard function**

`src/features/auth/guards/canAccessProfileRoute.ts`:

```ts
import type { AuthSession } from '@/app-providers/AuthProvider';
import type { ActiveProfile, ProfileType } from '@/features/auth/store/useActiveProfileStore';

export function canAccessProfileRoute(
  session: AuthSession | null,
  activeProfile: ActiveProfile | null,
  requiredType: ProfileType,
): boolean {
  if (!session || !activeProfile) {
    return false;
  }
  return activeProfile.type === requiredType;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- canAccessProfileRoute`
Expected: PASS

- [ ] **Step 5: Implement the hook wrapper (no unit test — thin router wiring)**

`src/features/auth/guards/useProfileGuard.ts`:

```ts
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app-providers/AuthProvider';
import { useActiveProfileStore, type ProfileType } from '@/features/auth/store/useActiveProfileStore';
import { canAccessProfileRoute } from './canAccessProfileRoute';

export function useProfileGuard(requiredType: ProfileType): void {
  const { session, isLoading } = useAuth();
  const activeProfile = useActiveProfileStore((state) => state.activeProfile);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!canAccessProfileRoute(session, activeProfile, requiredType)) {
      router.replace('/(auth)');
    }
  }, [isLoading, session, activeProfile, requiredType]);
}
```

- [ ] **Step 6: Wire the guard into the protected layouts**

Modify `app/(caregiver)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';
import { useProfileGuard } from '@/features/auth/guards/useProfileGuard';

export default function CaregiverLayout() {
  useProfileGuard('caregiver');

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
```

Modify `app/(family)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';
import { useProfileGuard } from '@/features/auth/guards/useProfileGuard';

export default function FamilyLayout() {
  useProfileGuard('family');

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Buscar' }} />
    </Tabs>
  );
}
```

- [ ] **Step 7: Verify typecheck and full test suite**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 8: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add profile route guard for caregiver and family route groups"
```

---

### Task 9: Realtime placeholder interface + EAS dev client

**Files:**
- Create: `src/shared/realtime/types.ts`
- Create: `eas.json`
- Modify: `app.json` (add `expo-dev-client` plugin entry if not already
  present from Task 1's template)

**Interfaces:**
- Produces:
  - `interface RealtimeChannel { subscribe(handler: (payload: unknown) => void): () => void; publish(payload: unknown): void }`
  - `interface RealtimeClient { connect(channelName: string): RealtimeChannel; disconnect(): void }`
  - No concrete implementation yet — feature plans (chat, SOS,
    geolocation) will implement `RealtimeClient` once a realtime backend is
    chosen.
- Produces: `eas.json` with a `development` build profile using
  `developmentClient: true`.

- [ ] **Step 1: Define the realtime interface**

`src/shared/realtime/types.ts`:

```ts
export interface RealtimeChannel {
  subscribe(handler: (payload: unknown) => void): () => void;
  publish(payload: unknown): void;
}

export interface RealtimeClient {
  connect(channelName: string): RealtimeChannel;
  disconnect(): void;
}
```

- [ ] **Step 2: Install the dev client package**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx expo install expo-dev-client
```

- [ ] **Step 3: Configure EAS build profiles**

```bash
cd /Users/pedrogodri/dev/cuidamais
npx eas build:configure
```

Edit the generated `eas.json` so the `development` profile matches:

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

- [ ] **Step 4: Verify typecheck and full test suite one last time**

Run: `npx tsc --noEmit && npm test && npm run lint`
Expected: no type errors, all tests pass, no lint errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/pedrogodri/dev/cuidamais
git add -A
git commit -m "feat: add realtime client interface placeholder and EAS dev client config"
```

---

## Definition of Done

- `npx tsc --noEmit`, `npm test`, and `npm run lint` all pass.
- App boots via `npx expo start` and all four route groups
  (`(auth)`, `(caregiver)`, `(family)`, `(shared)`) render their placeholder
  screens.
- Navigating to `/(caregiver)` or `/(family)` without a session and matching
  active profile redirects to `/(auth)`.
- Every architectural piece from the spec (folder structure, multi-profile
  auth, navigation groups, backend-agnostic API client, tooling, EAS dev
  client) has working, tested code — ready for the next plan (cadastro dos
  3 perfis + verificação) to build on top of it.
