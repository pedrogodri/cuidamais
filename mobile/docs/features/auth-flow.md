# Fluxo de autenticação (`app/(auth)/*`, `app/(shared)/home.tsx`)

Documenta o que existe hoje nas telas de auth — decisões tomadas, o que é
real vs. mockado, e por quê. Para convenções gerais de código (safe area,
tokens, testes), ver `../conventions.md`; para o modelo sessão/perfil, ver
`../architecture.md`.

## Fluxo

```
Splash (index.tsx)
  → auto-avança em 1.5s, ou toque → Onboarding
Onboarding (3 slides)
  → "Começar"/"Pular" → Signup
Signup
  → conta criada → (shared)/home.tsx   [replace, não push]
Login (alcançável a partir de Signup e vice-versa)
  → conta autenticada → (shared)/home.tsx   [replace, não push]
```

Não existe mais uma etapa de escolha de perfil no cadastro — **um único
login dá acesso à conta inteira**; qual perfil está ativo (Cuidador,
Responsável, Pessoa cuidada) é decidido depois, na Home. A tela
`app/(auth)/profile-choice.tsx` que existia nesse ponto do fluxo foi
removida (não só desligada — o arquivo não existe mais).

## Peças que sobraram da versão anterior do fluxo, ainda funcionais

Quando o cadastro tinha uma etapa de escolha de perfil antes da Home, essas
peças foram construídas e continuam no código, só não estão ligadas na
navegação principal:

- `src/shared/ui/ProfileOptionCard.tsx` — card de seleção de perfil (usado
  antes na tela removida).
- `src/features/auth/theme/profileTheme.ts` — mapeamento perfil → cor/ícone/
  label (`getProfileTheme`, `getProfileButtonTone`, `parseProfileType`).
  **Continua em uso** pelo `ProfileModeSwitcher` da Home e por
  `app/(auth)/confirmation.tsx`.
- `app/(auth)/confirmation.tsx` — tela de "conta criada", temática por
  perfil via parâmetro de rota `profile`. Não está mais linkada de lugar
  nenhum no momento (nada navega pra ela), mas continua funcional caso um
  fluxo de "ativar perfil" queira reaproveitá-la.

Se for reaproveitar essas peças em um fluxo novo (ex: um "adicionar
perfil" a partir da Home), comece por elas em vez de recriar.

## O que é mockado

- **Login e Signup**: validação de campo é real (nome/e-mail/senha mínima).
  Ao passar na validação, ambos chamam `AuthProvider.signIn({ token })` com
  um token mock (`` `mock-token-${Date.now()}` ``) antes de navegar pra Home
  — não existe ainda `createApiClient` instanciado pra auth, então não há
  chamada de backend real, mas a sessão fica populada de verdade (persistida
  via `expo-secure-store`), o que já destrava as rotas guardadas por
  `useProfileGuard` (`(caregiver)`/`(family)`) contanto que o perfil ativo
  correspondente também esteja setado.
- **Splash**: usa a logo real (`assets/splash-icon.png`), não é mais
  placeholder.

## Gotcha: link errado já corrigido uma vez

O link "Não tem conta? Cadastre-se" do Login apontava pra
`/(auth)/profile-choice` (rota que não existe mais) por um bom tempo —
sobrou de quando profile-choice vinha _antes_ do signup no fluxo antigo.
Foi corrigido para `/(auth)/signup`. Se esse tipo de link parecer estranho
de novo, é sinal de que a ordem do fluxo mudou e algum `router.push` não
foi atualizado junto.
