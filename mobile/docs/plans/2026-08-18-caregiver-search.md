# Busca de cuidadores (aba "Buscar") — plano

## Contexto

Depois de terminar o menu inferior (`app/(shared)/(tabs)/`), a aba "Buscar"
(visível só no modo Família/Pessoa cuidada) segue como placeholder puro —
`View`+`Text` fixo em `app/(shared)/(tabs)/buscar.tsx`. É o item 2 da ordem
de construção sugerida em `docs/product/vision.md` (logo depois de
cadastro/perfil, que já tem base construída) e é o próximo item que o
usuário escolheu priorizar, entre as opções restantes: Buscar, Agenda/Remédios,
Chat, Configurações.

Esse trabalho já tinha sido desenhado numa rodada anterior desta sessão
(antes de pivotar pro menu inferior) — este plano retoma esse design,
adaptado à estrutura de rotas atual (a tela agora é uma aba dentro de
`(tabs)`, não mais um grupo de rota `(family)` próprio, que foi removido).

**Ponto técnico chave (já identificado antes):** a rota `/(shared)/(tabs)/perfil`
só mostra o perfil do **próprio usuário logado** (guard implícito: só
aparece pro perfil ativo `caregiver`). Não dá pra reaproveitá-la pra família
visualizar o perfil de terceiros — precisa de uma rota nova, pública, com
id, fora da tab bar (empurrada por `push`, com botão de voltar).

## Escopo

- Lista mockada de cuidadores com busca por nome + filtro por especialidade.
- Cada card navega pro perfil público **daquele** cuidador específico (por
  id), reaproveitando os componentes já existentes e testados
  (`ProfileHeaderCard`, `AboutSection`, `ReviewsList` de
  `src/features/caregiver-profile/components/`).
- **Fora de escopo** (documentar como próximos itens do roadmap, mesmo
  padrão já usado no resto do app): mapa/geolocalização real (RF11), filtro
  por preço/disponibilidade, favoritar, contato/mensagem a partir do perfil
  (isso é chat, item separado do roadmap).

## Arquitetura

**Nova feature `src/features/caregiver-search/`:**

- `mockCaregivers.ts` — lista de ~3 cuidadores mockados: campos resumidos
  pra card de lista (id, nome, iniciais, especialidades, região, nota,
  valor/hora, selos) + campos completos por id (bio, anos de experiência,
  disponibilidade, avaliações) no mesmo formato de
  `src/features/caregiver-profile/mockCaregiverProfile.ts` (reaproveitar os
  tipos/shape, não reinventar).
- `components/SearchFilters.tsx` — campo de busca por nome (`TextField`,
  label visível — regra de acessibilidade do design system) + chips de
  especialidade (toggle, "Todos" + cada especialidade única presente na
  lista mockada).
- `components/CaregiverListItem.tsx` — card (avatar+nome+nota+especialidades+
  região+valor), `Pressable` navega pro perfil daquele id.

**`app/(shared)/(tabs)/buscar.tsx`:** substitui o placeholder atual — busca

- filtros + lista (`FlatList` ou `ScrollView` com poucos itens mockados) +
  estado vazio "Nenhum cuidador encontrado." quando o filtro não bate com
  nada.

**Nova rota `app/(shared)/caregiver/[id].tsx`:** perfil público de um
cuidador por id — fora da tab bar (o grupo `(shared)` continua sendo um
`Stack`, ver `mobile/docs/architecture.md`), alcançada via
`router.push('/(shared)/caregiver/' + id)` a partir do card da lista.
Reaproveita `ProfileHeaderCard`/`AboutSection`/`ReviewsList`, alimentados
por `MOCK_CAREGIVERS`/detalhes por id em vez do perfil fixo do usuário
logado. Cabeçalho com botão de voltar (`chevron-back` + `router.back()`) —
mesmo padrão já usado no app (`app/(caregiver-onboarding)/intro.tsx`), já
que aqui a tela **é** alcançada por push, diferente da aba "Perfil" (que
não tem botão de voltar por ser uma aba raiz — ver `navigation.md`).

## Testes (TDD, seguindo o padrão já estabelecido no projeto)

- `SearchFilters.test.tsx` — digitar no campo de busca e tocar num chip de
  especialidade disparam os callbacks certos.
- `CaregiverListItem.test.tsx` — renderiza os dados do cuidador; toque
  navega (`router.push`) pro id certo.
- `buscar.test.tsx` — lista filtra por nome e por especialidade
  corretamente; mostra o estado vazio quando não há resultado.
- `app/(shared)/caregiver/[id].test.tsx` — renderiza os dados do cuidador
  certo a partir do param `id`; botão de voltar chama `router.back()`.

## Documentação

- Novo `mobile/docs/features/caregiver-search.md` (mesmo formato de
  `caregiver-profile.md`/`home.md`): o que é real vs. mockado, como se
  chega lá, decisões (por que uma rota nova em vez de reaproveitar
  `(tabs)/perfil`).
- Atualizar `mobile/docs/architecture.md` (a aba Buscar deixa de ser
  placeholder) e `mobile/docs/requirements.md` (RF02/RF03 avançam de "não
  endereçado" pra "UI real, dados mockados").
- Atualizar `mobile/CLAUDE.md` (lista de docs).

## Verificação

- Por tarefa: implementar + escrever os testes unitários dela + rodar só
  esses testes (`npm test -- <arquivo>`). Sem rodar a suíte completa,
  lint ou typecheck a cada passo (ver `mobile/CLAUDE.md` "Working session
  conventions") — isso fica pra quando o usuário pedir ou perto de
  commitar/mergear.
- Como não dá pra rodar o simulador neste ambiente, pedir confirmação
  visual ao usuário depois de implementado (como já aconteceu com o bug do
  menu inferior, que só apareceu rodando de verdade).
