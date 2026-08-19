# Perfil público do cuidador (`app/(shared)/(tabs)/perfil.tsx`)

Documenta o que existe hoje na aba "Perfil" da tab bar — a
visão pública do cuidador (nome, avaliações, especialidades), correspondente
a RF03/RF04 de `../../../docs/product/vision.md`.

## O que é

Tela de leitura (sem edição) mostrando o perfil do cuidador como ele
apareceria pra uma família na busca. Composta por três seções:

```
app/(shared)/(tabs)/perfil.tsx              — tela fina, monta a tela

src/features/caregiver-profile/
  components/
    ProfileHeaderCard.tsx   — avatar (iniciais), nome, selos, nota + nº de avaliações
    AboutSection.tsx        — bio, especialidades (chips), experiência, região, disponibilidade, valor/hora
    ReviewsList.tsx         — lista de avaliações (autor, nota, comentário, data); estado vazio "Sem avaliações ainda."
  mockCaregiverProfile.ts   — MOCK_CAREGIVER_PROFILE + MOCK_REVIEWS
```

Os selos "Verificado" e "Mais bem avaliado" reaproveitam
`VerificationStatusBadge` de
`src/features/caregiver-onboarding/components/` (mesmo componente do fluxo
de verificação) em vez de duplicar o padrão de badge.

**Sem botão de voltar.** Existia (`chevron-back` + `router.back()`)
enquanto essa tela era alcançada por push a partir da Home; como aba raiz
da tab bar (ver `navigation.md`), voltar não faz sentido — não há "de
onde voltar". O cabeçalho ficou só `<H3>Perfil</H3>` com uma borda
inferior sutil (`border-neutral-100`) separando do conteúdo. O header
nativo do `Tabs.Screen` continua desligado (`headerShown: false` no
`_layout.tsx` compartilhado), já que quem desenha o cabeçalho é a própria
tela.

## O que é mockado

Tudo. `MOCK_CAREGIVER_PROFILE`/`MOCK_REVIEWS` são dados fixos — não há
cadastro profissional real (RF04) nem edição desses campos, avaliação
bidirecional real (RF12/RF13), verificação de identidade/antecedentes
ligada a esse perfil (isso é o fluxo separado em
`caregiver-onboarding.md`), nem foto real (só iniciais). O valor/hora é
só informativo, sem processar pagamento (NEG04).

## Como se chega lá

É a aba "Perfil" da tab bar (`app/(shared)/(tabs)/`), visível só quando o
perfil ativo é `caregiver` — ver `navigation.md` pra regra completa de
visibilidade por perfil. Antes de virar aba, essa tela vivia em
`(caregiver)/index.tsx` e era alcançada por um botão na Home
(`router.push('/(caregiver)')`); esse grupo de rota foi removido quando o
menu inferior substituiu a navegação por push.

## Testes

- `ProfileHeaderCard.test.tsx`, `AboutSection.test.tsx`,
  `ReviewsList.test.tsx` cobrem os três componentes com dados fixos,
  incluindo o estado vazio de `ReviewsList` (lista sem avaliações).
- Chegar na tela agora é só visibilidade de aba, coberta por
  `getVisibleTabs.test.ts` (ver `navigation.md`) — o antigo teste do link
  "Ver meu perfil público" em `home.test.tsx` foi removido junto com o
  link.
