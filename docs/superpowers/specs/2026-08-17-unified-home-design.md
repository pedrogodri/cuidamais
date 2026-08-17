# Home unificada — design

**Data:** 2026-08-17
**Status:** Aprovado para implementação

## Contexto

Hoje `app/(shared)/home.tsx` é um placeholder: texto de boas-vindas fixo +
um botão de teste "Quero ser cuidador". Este spec desenha a Home de
verdade — o painel inicial que a pessoa vê depois de logar, que se adapta
conforme o perfil ativo no momento (Cuidador, Responsável, Pessoa cuidada).

Referência visual trazida pelo usuário: três apps diferentes — um app de
cuidador prestador de serviço (cartão de atendimento em andamento +
tarefas do dia), um app de saúde pessoal (anéis de atividade/sono) e o
MediFlow (lista de remédios do dia com status). A ideia é sintetizar os
dois primeiros e o terceiro num único painel que muda de conteúdo conforme
quem está olhando — não três apps, uma Home que veste três chapéus.

## Decisões

1. **A Home adapta por perfil ativo**, lido de `useActiveProfileStore`. O
   layout base (header, seletor) é o mesmo pros três; a seção principal de
   conteúdo troca.
2. **Sem anéis de atividade/sono/calorias.** Isso é linguagem de app
   fitness, não do escopo de saúde do CuidaMais. O que aparece é só o que
   já está em `docs/product/vision.md`: remédios, sinais vitais
   (pressão/glicemia/peso), agenda de consultas.
3. **Cards mostram dado mockado, sem tela de destino ainda.** Remédios,
   sinais vitais e agenda são os próximos itens do roadmap (item 4 e 5) —
   a Home antecipa a forma visual, mas tocar num card não abre nada agora.
   Isso mantém a Home focada em ser a Home, sem inflar o escopo desta
   rodada com telas de domínios que ainda não têm spec própria.
4. **Modo Cuidador mostra um atendimento mockado como ativo** (cliente,
   clock-in, cronômetro, tarefas do dia) — mesmo sem contratação real
   existir ainda (isso é roadmap item 2), estabelece o padrão visual que
   será usado quando existir de verdade.
5. **Seletor de perfil de teste, visível na própria Home.** Sem login
   real ainda, a única forma de revisar os três modos é trocando
   manualmente. O seletor chama `setActiveProfile` de verdade — não é só
   decorativo, é como o app inteiro sabe "qual perfil está ativo" hoje.
6. **Header com saudação + avatar + notificação.** Ícones sem destino
   ainda (perfil e notificações são telas futuras), mas dá o espaço
   estrutural certo desde já.

## Arquitetura

```
app/(shared)/home.tsx                                  — lê useActiveProfileStore, monta a tela

src/features/home/
  components/
    HomeHeader.tsx            — saudação (Bom dia/Boa tarde/Boa noite) + avatar + sino
    ProfileModeSwitcher.tsx   — 3 chips (Cuidador/Responsável/Pessoa cuidada), chama setActiveProfile
    OngoingCareCard.tsx       — modo Cuidador: cliente mockado, clock-in, cronômetro, "Finalizar atendimento"
    TodaysTasksCard.tsx       — modo Cuidador: 2-3 tarefas mockadas (horário, título, prioridade)
    MedicationsCard.tsx       — modo família: remédios do dia (nome, horário, status)
    VitalSignsCard.tsx        — modo família: última pressão/glicemia/peso registrados
    UpcomingAppointmentCard.tsx — modo família: próxima consulta/exame mockada
  mockData.ts                 — dados de exemplo usados pelos cards acima
```

`ProfileModeSwitcher` cobre tanto Responsável quanto Pessoa cuidada com o
mesmo bloco de conteúdo (`MedicationsCard` + `VitalSignsCard` +
`UpcomingAppointmentCard`), variando só a legenda: Responsável vê "Cuidando
de: {nome}" acima dos cards, Pessoa cuidada vê os dados como próprios (sem
essa legenda).

## Conteúdo por modo

### Cuidador (tom petrol)
- `OngoingCareCard`: nome do cliente mockado (ex: "Dona Marta"), horário de
  clock-in, cronômetro decorrido (atualiza a cada segundo via
  `setInterval`, sem persistência — reseta ao desmontar), botão "Finalizar
  atendimento" (sem ação real ainda, só visual).
- `TodaysTasksCard`: lista de 2-3 tarefas mockadas com horário, título e
  chip de prioridade (ex: "10:00 · Medicamento — Losartana · Alta
  prioridade"), sem interação de marcar concluída ainda.

### Responsável / Pessoa cuidada (tom vinculo / amber conforme o perfil)
- `MedicationsCard`: 2-3 remédios do dia mockados, cada um com nome,
  horário e status (Tomado/Pendente/Atrasado) via badge colorido.
- `VitalSignsCard`: última pressão, glicemia e peso registrados (mockados),
  com data.
- `UpcomingAppointmentCard`: próxima consulta/exame mockada (especialidade,
  data, horário, local).

## Fora de escopo (deliberado)

- Navegação de qualquer card pra tela de detalhe (remédio, tarefa, consulta).
- Múltiplas pessoas vinculadas no seletor (Responsável só vê uma pessoa
  cuidada mockada, não uma lista).
- Notificações e perfil (ícones do header sem tela de destino).
- Qualquer persistência do cronômetro do atendimento entre sessões.

## Testes

Sem lógica de negócio nova além do `ProfileModeSwitcher` chamando
`setActiveProfile` (já coberto por `useActiveProfileStore.test.ts`) — os
cards são apresentacionais com dados mockados fixos, então não pedem teste
de unidade próprio além do que os componentes de UI existentes já têm
(`Button`, `Typography`). Verificação é visual (screenshot no simulador
por modo), como já vem sendo feito nas outras telas.

## Documentação

Depois de implementado, criar `mobile/docs/features/home.md` (mesmo
formato de `auth-flow.md` e `caregiver-onboarding.md`) documentando o
resultado — este spec é o registro da decisão, aquele é o registro do que
existe no código.
