# Home unificada (`app/(shared)/home.tsx`)

Documenta o que existe hoje na Home — decisão original em
`docs/superpowers/specs/2026-08-17-unified-home-design.md`, este arquivo é
o registro do que ficou implementado. Para o modelo sessão/perfil ativo,
ver `../architecture.md`.

## O que é

O painel inicial pós-login, que muda de conteúdo conforme o **perfil
ativo** (`useActiveProfileStore`), lido em `app/(shared)/home.tsx`. Header
e `ProfileModeSwitcher` são fixos; a seção principal troca por tipo de
perfil (`caregiver` / `family` / `cared_person`).

## Estrutura

```
app/(shared)/home.tsx                                  — lê useActiveProfileStore, monta a tela

src/features/home/
  components/
    HomeHeader.tsx               — saudação + avatar (iniciais) + sino
    ProfileModeSwitcher.tsx      — 3 chips, chama setActiveProfile de verdade
    OngoingCareCard.tsx          — modo Cuidador: cliente, clock-in, cronômetro
    TodaysTasksCard.tsx          — modo Cuidador: lista de tarefas do dia
    MedicationsCard.tsx          — modo família: remédios do dia
    VitalSignsCard.tsx           — modo família: pressão/glicemia/peso
    UpcomingAppointmentCard.tsx  — modo família: próxima consulta
  mockData.ts                    — dados de exemplo usados pelos cards acima
  getGreeting.ts                 — "Bom dia"/"Boa tarde"/"Boa noite" por hora do dia
  formatElapsed.ts               — segundos → "HH:MM:SS" (cronômetro do atendimento)
```

## Conteúdo por modo

`activeProfile?.type` decide qual bloco aparece; `family` e `cared_person`
compartilham o mesmo bloco de conteúdo (`isFamilyMode` em `home.tsx`):

- **`caregiver`**: `OngoingCareCard` + `TodaysTasksCard`.
- **`family`**: legenda "Cuidando de: {nome}" + `MedicationsCard` +
  `VitalSignsCard` + `UpcomingAppointmentCard`.
- **`cared_person`**: os mesmos três cards de `family`, mas sem a legenda —
  os dados aparecem como próprios, não de alguém que a pessoa cuida.
- **`activeProfile === null`** (nenhum modo escolhido ainda): estado vazio
  com ícone + "Escolha um modo acima para ver sua Home." em vez de tela em
  branco.

O CTA "Quero ser cuidador" (→ `/(caregiver-onboarding)/intro`, ver
`caregiver-onboarding.md`) aparece pra qualquer perfil que não seja
`caregiver`, inclusive quando `activeProfile` é `null`.

## `ProfileModeSwitcher`: por que é real, não decorativo

Não existe ainda login que decida qual perfil está ativo (uma conta pode
ter vários — Cuidador, Responsável, Pessoa cuidada — mas isso é decidido
depois do login, não no cadastro; ver `auth-flow.md`). Enquanto essa peça
não existe, o `ProfileModeSwitcher` da própria Home **é** o mecanismo:
cada chip chama `setActiveProfile({ type, id: 'preview' })` de verdade no
`useActiveProfileStore` (Zustand, sem persistência — reseta ao reiniciar o
app). O `id: 'preview'` é um placeholder deliberado: hoje não há uma lista
real de perfis vinculados à conta pra escolher um id de verdade.

Isso significa que qualquer guard de rota que leia `activeProfile.type`
(`useProfileGuard`, ver `../architecture.md`) já funciona de ponta a ponta
hoje — só a origem do valor é manual em vez de vir de uma sessão
persistida. Trocar os chips por uma escolha real de perfil pós-login é
substituir a fonte do `setActiveProfile`, não reescrever o consumidor.

**Direção decidida pro próximo ciclo (ainda não implementada):** a versão
real não vai ser 3 chips sempre visíveis — vai ser um **dropdown na Home**
que só lista os perfis que a conta realmente tem vinculados (ex: alguém
que só é Responsável não vê "Cuidador" como opção). Isso também fecha o
gap do RF21/NEG06 em `../requirements.md` — o dropdown na Home passa a ser
o mecanismo de "escolha de perfil" que aquele requisito pede, no lugar da
tela de escolha centralizada que existia antes (`profile-choice.tsx`,
removida — ver `auth-flow.md`). Vai exigir uma lista real de perfis
vinculados à conta (hoje só existe o perfil ativo, não a lista de quais
existem) antes de dar pra construir de verdade.

A ordem dos chips (`PROFILE_ORDER` em
`src/features/auth/theme/profileTheme.ts`) é Cuidador → Pessoa cuidada →
Responsável, e cada chip usa a cor do perfil (`getProfileTheme`) quando
selecionado — mesmo mapeamento perfil → cor/ícone/label usado em
`app/(auth)/confirmation.tsx`.

## O que é mockado

Tudo. Nenhum card busca dado de rede — todos os valores vêm de
`src/features/home/mockData.ts`:

- `MOCK_ONGOING_CARE` — cliente "Dona Marta", clock-in "09:30" (usado por
  `OngoingCareCard`; o cronômetro em si é calculado localmente, ver abaixo).
- `MOCK_TODAYS_TASKS` — 3 tarefas fixas (`TodaysTasksCard`).
- `MOCK_MEDICATIONS` — 3 remédios fixos com status `taken`/`pending`/`late`
  (`MedicationsCard`).
- `MOCK_VITAL_SIGNS` — pressão/glicemia/peso/data fixos (`VitalSignsCard`).
- `MOCK_APPOINTMENT` — consulta fixa (`UpcomingAppointmentCard`).
- `MOCK_CARED_PERSON_NAME` — "Dona Marta", usado só na legenda "Cuidando
  de: ..." do modo `family`.
- O nome "Maria Silva" passado pro `HomeHeader` está hardcoded direto em
  `home.tsx` (não está em `mockData.ts`).

Nenhum card navega pra lugar nenhum ao tocar — remédios, sinais vitais e
agenda ainda não têm tela de detalhe (são os próximos itens do roadmap;
ver `docs/product/vision.md`). O botão "Finalizar atendimento" do
`OngoingCareCard` também não tem ação (`onPress={() => {}}`).

## Cronômetro do atendimento

`OngoingCareCard` conta os segundos localmente com `setInterval` a partir
de 0 (não a partir do horário de clock-in mockado) e formata via
`formatElapsed`. Sem persistência: sai da tela ou desmonta o componente e o
tempo reseta. Não é pra ler como "quanto tempo desde 09:30", é só o padrão
visual de cronômetro rodando.

## Testes

- `getGreeting.test.ts` e `formatElapsed.test.ts` cobrem os dois helpers
  puros (saudação por horário, formatação `HH:MM:SS` do cronômetro).
- `HomeHeader.test.tsx` e `ProfileModeSwitcher.test.tsx` cobrem os
  componentes fixos do topo com RTL, incluindo o `ProfileModeSwitcher`
  chamando `setActiveProfile` de verdade no store ao tocar num chip (o
  store em si já tem sua própria suíte em `useActiveProfileStore.test.ts`).
- Os cinco cards (`OngoingCareCard`, `TodaysTasksCard`, `MedicationsCard`,
  `VitalSignsCard`, `UpcomingAppointmentCard`) são apresentacionais com
  dados mockados fixos e não têm arquivo de teste dedicado — verificação é
  visual (screenshot no simulador por modo), como nas outras telas.

## Decisão original

`docs/superpowers/specs/2026-08-17-unified-home-design.md` — por que não
tem anéis de atividade/sono (fora do escopo de saúde do CuidaMais), por
que os cards mostram dado mockado sem tela de destino ainda, e por que o
seletor de perfil vive na própria Home.
