# CuidaMais — Arquitetura base do app React Native

**Data:** 2026-08-12
**Status:** Aprovado para implementação

## Contexto

CuidaMais é uma plataforma de cuidados digitais que conecta três tipos de
perfil — **Cuidador**, **Pessoa cuidada** e **Responsável** — cobrindo
cadastro/verificação, busca e contratação de cuidadores, comunicação (chat,
SOS), e gestão de saúde (remédios, agenda, sinais vitais). A visão de produto
completa cobre múltiplos subsistemas independentes (perfis, marketplace de
busca, comunicação em tempo real, saúde/agenda, backoffice administrativo).

Este spec cobre **apenas a arquitetura base do app mobile React Native** —
a fundação estrutural sobre a qual cada módulo de produto (cadastro,
busca, chat, remédios, agenda...) será construído em ciclos de spec/plano
incrementais separados, seguindo a ordem sugerida no briefing de produto:

1. Cadastro dos 3 perfis + verificação básica de identidade
2. Busca por região + perfil público com avaliações
3. Chat
4. Cadastro de remédio + lembrete + confirmação
5. Agenda simples
6. Mapa com geolocalização
7. Avaliação dupla pós-atendimento

O painel de administração (backoffice) fica em repositório separado (app web)
e está fora do escopo deste projeto.

## Objetivo

Definir a estrutura de projeto, stack e convenções que permitam:

- Múltiplos times/features evoluindo em paralelo sem conflito de código
- Um usuário ter múltiplos perfis na mesma conta (ex: Responsável e Cuidador)
  e trocar de perfil ativo sem novo login
- Trocar o backend (ainda não definido) sem reescrever telas
- Escalar para dezenas de telas sem degradar organização

## Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | Expo (managed workflow) | Acesso simples a câmera, GPS, push, upload de documento, OTA updates — todos necessários no produto |
| Linguagem | TypeScript | Volume de dados de saúde e permissões granulares por perfil se beneficiam de tipagem forte |
| Navegação | Expo Router | Roteamento por arquivos, grupos de rota por perfil, deep links nativos (convites, notificações, SOS) |
| Estado servidor | TanStack Query | Cache e sincronização de dados remotos (perfis, buscas, histórico, chat) |
| Estado local/UI | Zustand | Perfil ativo, filtros, estado de UI que não vem do servidor |
| Estilo | NativeWind (Tailwind para RN) | Produtividade e consistência visual dado o grande número de telas do produto |
| Build | EAS Build (dev client desde o início) | Módulos como câmera, GPS, push e upload exigem dispositivo real, não só Expo Go |
| Testes | Jest + React Native Testing Library | Padrão do ecossistema RN |
| Lint/format | ESLint + Prettier + Husky/lint-staged | Consistência automática no commit |

Backend ainda não definido — a camada de dados é desenhada para ser
agnóstica de backend (ver seção "Camada de dados").

## Estrutura de pastas

Modelo **feature-based**: pastas organizadas por domínio de produto, não por
tipo de arquivo. Cada domínio (auth, perfis, busca, chat, remédios, agenda,
avaliações) cresce de forma isolada.

```
app/                        # Expo Router — só rotas/telas finas
  (auth)/                   # login, cadastro, escolha de perfil
  (caregiver)/              # rotas exclusivas do perfil Cuidador (tab navigator próprio)
  (family)/                 # rotas do perfil Responsável / Pessoa cuidada (tab navigator próprio)
  (shared)/                 # chat, notificações, configurações — acessível dos dois lados
  _layout.tsx

src/
  features/                 # 1 pasta por domínio de produto
    auth/
    caregiver-profile/
    search/
    chat/
    medications/
    schedule/
    reviews/
    <feature>/
      api/                  # hooks TanStack Query específicos da feature
      components/
      hooks/
      store/                # slice Zustand, se a feature precisar
      types.ts
  shared/
    ui/                     # componentes de design system (Button, Card, Input...)
    api/                    # api client base (interceptors, tratamento de erro)
    realtime/               # abstração de chat/geolocalização em tempo real
    hooks/
    utils/
    types/
  app-providers/            # QueryClientProvider, AuthProvider, etc.
```

**Regra:** telas em `app/` importam de `src/features/*` e ficam finas — só
composição e navegação. Toda lógica de negócio e estado mora dentro da
feature correspondente. Componentes de teste ficam ao lado do código que
testam (não em pasta `__tests__` separada).

## Autenticação e múltiplos perfis

Um usuário pode ter mais de um perfil vinculado à mesma conta (ex:
Responsável e Cuidador simultaneamente). Sessão de autenticação e perfil
ativo são conceitos **separados**:

- **Sessão** — um token de auth por conta, gerenciado por um `AuthProvider`
  global. Login/logout afeta a conta inteira.
- **Perfil ativo** — guardado no Zustand (`useActiveProfileStore`), contém o
  tipo (`caregiver` | `family` | `cared_person`) e o id do perfil
  selecionado. Trocar de perfil ativo não desloga — só muda o contexto de
  navegação e quais dados são buscados.
- Rotas em `app/(caregiver)` e `app/(family)` são protegidas por um guard
  que verifica: (1) sessão autenticada, (2) conta possui esse tipo de
  perfil vinculado, (3) redireciona para tela de escolha de perfil quando
  necessário.

## Navegação (Expo Router)

- `app/(auth)` — login, cadastro, escolha de perfil (sem tabs)
- `app/(caregiver)` — tab navigator próprio: Perfil público, Agenda de
  atendimentos, Chat, Configurações
- `app/(family)` — tab navigator próprio: Busca de cuidadores, Pessoas
  vinculadas, Remédios/Agenda, Chat
- `app/(shared)` — telas empilhadas fora de tabs, acessíveis dos dois lados:
  chat individual, detalhes de notificação, configurações, SOS
- Deep links (convite de responsável, notificação push, SOS) mapeiam para
  rotas dentro desses grupos.

Trocar o perfil ativo troca qual grupo de rota é a "home"; telas
compartilhadas (chat, configurações) não são duplicadas entre grupos.

## Camada de dados (agnóstica de backend)

Backend ainda não decidido — toda comunicação externa fica isolada:

- `src/shared/api/client.ts` — instância única (fetch/axios) com base URL,
  interceptor de token de auth, tratamento de erro padronizado. É o único
  ponto que muda se o backend for trocado (ex: REST próprio → Supabase).
- Cada feature expõe hooks próprios sobre esse client, usando TanStack
  Query (`features/medications/api/useMedications.ts`). Componentes nunca
  chamam o client diretamente.
- `src/shared/realtime/` isola a lógica de tempo real (chat, geolocalização
  do cuidador, SOS) — hoje um placeholder de interface, evitando que a
  lógica de socket vaze para componentes de UI quando a solução de
  realtime for escolhida (Supabase Realtime, socket.io, etc.).

## Qualidade e tooling

- ESLint + Prettier com config padrão Expo/RN
- Jest + React Native Testing Library para testes de componente/hook
- Husky + lint-staged para lint/format automático no commit
- EAS Build com dev client configurado desde o início do projeto

## Fora de escopo deste spec

- Qualquer módulo de produto específico (auth/cadastro, busca, chat,
  remédios, agenda, avaliações) — cada um vira seu próprio spec/plano,
  seguindo a ordem de construção sugerida no briefing.
- Escolha e integração de backend.
- Backoffice administrativo (repositório separado).
