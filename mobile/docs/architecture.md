# Arquitetura — CuidaMais mobile

Referência de arquitetura do app. Para o design visual (cores, tipografia,
espaçamento, componentes), veja `design/design-system.md` — este
documento cobre apenas estrutura de código, navegação e dados.

## Stack

| Camada          | Escolha                                                        |
| --------------- | -------------------------------------------------------------- |
| Framework       | Expo (SDK 57), managed workflow com dev client desde o início  |
| Linguagem       | TypeScript, `strict: true`                                     |
| Navegação       | Expo Router (file-based, `app/`)                               |
| Estado servidor | TanStack Query                                                 |
| Estado local/UI | Zustand                                                        |
| Estilo          | NativeWind (Tailwind para RN) — tokens em `tailwind.config.js` |
| Testes          | Jest (`jest-expo` preset) + React Native Testing Library       |

`AGENTS.md` na raiz do projeto mobile lembra que o Expo mudou muito entre
versões: sempre confira `https://docs.expo.dev/versions/v57.0.0/` antes de
usar uma API que não está clara no código existente.

## Estrutura de pastas

Modelo feature-based. `app/` é só roteamento — telas finas que importam de
`src/features/*` e compõem. Toda lógica de negócio, estado e chamadas de API
moram dentro da feature.

```
app/
  (auth)/        # login, cadastro, onboarding, escolha de perfil — sem tabs
  (shared)/(tabs)/ # único Tabs navigator pós-login, abas mudam com o perfil ativo
  (shared)/      # telas empilhadas acessíveis dos dois lados (configurações, etc.)
  _layout.tsx    # providers globais + carregamento de fontes + splash nativa

src/
  features/<feature>/
    api/         # hooks TanStack Query da feature
    components/
    hooks/
    store/       # slice Zustand, se a feature precisar
    theme/       # mapeamentos de tema específicos da feature (ex: profileTheme)
    types.ts
  shared/
    ui/          # design system: Typography, Button, TextField, theme.ts, fonts.ts
    api/         # client.ts (factory Axios) + errors.ts (ApiError, normalizeApiError)
    realtime/    # abstração de chat/geolocalização (hoje só interface, sem impl.)
    utils/
  app-providers/ # AuthProvider — contexto global de sessão
```

Regra: um componente em `app/` nunca contém lógica de negócio direta — ele
monta a tela a partir de peças de `src/shared/ui` e `src/features/*`.

## Sessão vs. perfil ativo

Dois conceitos deliberadamente separados, porque uma conta pode ter mais de
um perfil (ex: Responsável e Cuidador na mesma conta):

- **Sessão** (`AuthProvider` em `src/app-providers/AuthProvider.tsx`) — um
  token por conta, persistido via `expo-secure-store`. `useAuth()` expõe
  `{ session, isLoading, signIn, signOut }`. Login/logout afeta a conta
  inteira.
- **Perfil ativo** (`useActiveProfileStore` em
  `src/features/auth/store/useActiveProfileStore.ts`) — Zustand store com
  `{ type: 'caregiver' | 'cared_person' | 'family', id: string } | null`.
  Trocar de perfil ativo não desloga, só muda o contexto de navegação e quais
  dados são buscados.

Por causa disso, **criar conta não escolhe perfil** — um único login serve
para tudo. `Signup` (sem tema/cor, cadastro puro) vai direto para
`app/(shared)/(tabs)/home.tsx`. Escolher/ativar um perfil específico (ex: virar
Cuidador) é um fluxo separado, iniciado a partir da Home, não do cadastro —
ver a seção "Verificação de Cuidador" abaixo. `ProfileOptionCard`,
`profileTheme.ts` e a tela `app/(auth)/confirmation.tsx` continuam existindo
(reaproveitáveis para quando esse fluxo de escolha de perfil for retomado),
só não estão ligados na navegação principal no momento.

### Guard de rota por perfil

`src/features/auth/guards/`:

- `canAccessProfileRoute(session, activeProfile, requiredType)` — função pura,
  só retorna `true` se houver sessão **e** o perfil ativo bater com o tipo
  exigido pela rota.
- `useProfileGuard(requiredType)` — hook que roda essa checagem em
  `useEffect` e faz `router.replace('/(auth)')` quando falha. Hoje nenhum
  `_layout.tsx` chama esse hook: o único grupo protegido pós-login,
  `(shared)/(tabs)`, usa `useSessionGuard` (protege por sessão, não por
  tipo de perfil) e cada aba só aparece ou some conforme o perfil ativo
  (`isTabVisible`). `useProfileGuard`/`canAccessProfileRoute` continuam
  existindo, sem uso ativo, prontos pra quando um guard por tipo dentro de
  uma aba específica for necessário — ver `features/navigation.md`.

`(shared)` não tem guard próprio — é o grupo de telas acessíveis dos dois
lados (chat, configurações), então a proteção fica a cargo de cada tela
individual quando fizer sentido.

## Camada de dados (agnóstica de backend)

Backend ainda não definido — toda comunicação externa fica isolada em
`src/shared/api/`:

- `client.ts` — `createApiClient({ baseURL, getToken })` monta uma instância
  Axios com interceptor de auth header e normalização de erro. Nenhuma
  instância global é exportada ainda; cada consumidor futuro cria a sua ou
  isso é centralizado quando o backend for escolhido.
- `errors.ts` — `ApiError` + `normalizeApiError()` extraem `{code, message}`
  de erros Axios de forma padronizada.
- Cada feature deve expor hooks próprios sobre esse client usando TanStack
  Query (`features/<feature>/api/useX.ts`) — componentes nunca chamam o
  client diretamente.
- `src/shared/realtime/types.ts` define só a interface (`RealtimeClient`,
  `RealtimeChannel`) — sem implementação ainda. Não importe um SDK de
  realtime específico até essa decisão ser tomada.

## Navegação (Expo Router)

- `app/(auth)` — Stack sem header (`_layout.tsx` usa
  `<Stack screenOptions={{ headerShown: false }} />`). Fluxo:
  `index` (splash) → `onboarding` → `signup` → `(shared)/(tabs)/home`.
- `app/(shared)/(tabs)` — um único `Tabs` navigator pós-login, guardado só
  por sessão (`useSessionGuard`, não por tipo de perfil). As abas visíveis
  mudam com o perfil ativo (`isTabVisible`) — ver
  `features/navigation.md`. Home é a única aba sempre visível.
- `app/(shared)` (fora de `(tabs)`) — `Stack` simples, sem guard;
  `settings.tsx` mora aqui, fora da tab bar.
- `app/(caregiver-onboarding)` — Stack sem header, também sem guard (o
  usuário ainda não é Cuidador enquanto passa por ele). Fluxo mockado de
  verificação de identidade para virar Cuidador — 11 telas, sem lógica real
  de verificação (documento, telefone, e-mail e selfie são só simulados).
  Estado compartilhado entre as telas fica em
  `src/features/caregiver-onboarding/store/useCaregiverVerificationStore.ts`.
  Ver componentes de apoio em `src/features/caregiver-onboarding/components/`
  (`VerificationStepHeader`, `VerificationStatusBadge`, `SelectableRow`).

**Gotcha de desenvolvimento:** o Expo Router persiste o estado de navegação
em dev (via AsyncStorage) para sobreviver a Fast Refresh. Isso significa que
relançar o app depois de uma mudança de código pode retomar numa rota
anterior em vez de voltar para `/(auth)` — não é bug do app, é comportamento
de dev. Para testar do zero, use um deep link explícito
(`xcrun simctl openurl booted "cuidamais://onboarding"`) ou o botão
"Reset" na tela do dev client.

## O que é placeholder vs. real

- `app/(auth)/*` (splash, onboarding, signup, login) e
  `app/(shared)/(tabs)/home.tsx` — completos, é o caminho principal
  navegável hoje.
- `app/(caregiver-onboarding)/*` — telas completas, mas **totalmente
  mockado**: nenhuma integração real (OCR, reconhecimento facial, SMS,
  e-mail, backend). Existe para validar a experiência visual antes de
  qualquer integração — ver `app/(caregiver-onboarding)/intro.tsx` e
  vizinhos para os detalhes de cada estado simulado.
- `app/(shared)/(tabs)/perfil.tsx` — perfil público do cuidador, real
  (dados mockados), aba visível só no modo Cuidador. Ver
  `features/caregiver-profile.md`.
- `app/(shared)/(tabs)/buscar.tsx`, `agenda.tsx`, `chat.tsx` e
  `(shared)/settings.tsx` ainda são placeholders (`View` + `Text` fixos) —
  cada um vira seu próprio ciclo de spec/plano conforme a ordem do roadmap
  de produto (busca, chat, remédios, agenda...).
