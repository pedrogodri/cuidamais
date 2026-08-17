# Requisitos — CuidaMais mobile

Requisitos funcionais, não funcionais e regras de negócio do app mobile.
Escrito a partir da arquitetura real do projeto (ver `architecture.md`) —
alguns itens aqui descrevem comportamento já implementado, outros o
comportamento que a implementação deve ter quando aquela parte for
construída (ver "Gaps conhecidos" no final para o que ainda diverge).

Consulte este documento antes de implementar qualquer feature nova — ele é
o contrato de requisitos que a implementação precisa satisfazer.

---

## 1. Requisitos funcionais

RF01 – O aplicativo deve permitir que uma mesma conta possua mais de um
perfil vinculado (Cuidador, Pessoa cuidada e/ou Responsável), com seleção
de perfil ativo sem necessidade de novo login. _(implementado —
`useActiveProfileStore`, ver `architecture.md` seção "Sessão vs. perfil
ativo")_

RF02 – O aplicativo deve realizar a visualização e busca de cuidadores
disponíveis, filtrando por região, especialidade e disponibilidade.

RF03 – O aplicativo deve permitir a visualização do perfil público do
cuidador, incluindo avaliações, comentários e região de atendimento.

RF04 – O aplicativo deve permitir que o cuidador realize seu cadastro
profissional, informando experiência, especialidades e certificações.

RF05 – O aplicativo deve permitir o upload de documentos e selfie (via
câmera do dispositivo) para verificação de identidade do cuidador.
_(a experiência visual está mockada em
`app/(caregiver-onboarding)/*` — ver `features/caregiver-onboarding.md`;
a captura real de câmera/upload ainda não existe)_

RF06 – O aplicativo deve realizar a consulta de antecedentes criminais do
cuidador por meio de integração com API externa.

RF07 – O aplicativo deve permitir o cadastro da pessoa a ser cuidada, com
dados de saúde básicos (condições, restrições, alergias).

RF08 – O aplicativo deve permitir que a pessoa cuidada possua conta
própria ou seja cadastrada por um Responsável, mediante aceite/consentimento.

RF09 – O aplicativo deve permitir que um Responsável vincule mais de uma
pessoa cuidada à sua conta.

RF10 – O aplicativo deve fornecer funcionalidade de chat em tempo real
entre cuidador, pessoa cuidada e responsável, acessível a partir de
qualquer perfil ativo. _(mora em `app/(shared)/`, coerente com o grupo de
rotas "acessível dos dois lados" — ver `architecture.md`; ainda não
implementado, ver `src/shared/realtime/types.ts`)_

RF11 – O aplicativo deve fornecer um mapa com geolocalização (via GPS do
dispositivo) para localizar cuidadores próximos.

RF12 – O aplicativo deve permitir que o usuário registre uma avaliação com
nota e comentário após cada atendimento.

RF13 – O aplicativo deve permitir avaliação em via dupla, possibilitando
que o cuidador também avalie a família/pessoa cuidada.

RF14 – O aplicativo deve permitir o cadastro de medicamentos, incluindo
nome, dosagem, via de administração e horário. _(a Home já mostra um
preview mockado desse dado — ver `features/home.md`)_

RF15 – O aplicativo deve enviar lembretes push (via serviço de
notificações do Expo) nos horários programados de medicação.

RF16 – O aplicativo deve permitir a confirmação de "remédio administrado",
registrando qual usuário realizou a confirmação.

RF17 – O aplicativo deve permitir o cadastro de agenda de compromissos
(consultas, exames) e tarefas recorrentes de cuidado. _(a Home já mostra
um preview mockado desse dado — ver `features/home.md`)_

RF18 – O aplicativo deve permitir que o usuário assine digitalmente um
termo/contrato simples de prestação de serviço.

RF19 – O aplicativo deve fornecer um botão de emergência (SOS), acessível
a partir de qualquer perfil ativo, que notifique o responsável e/ou
contatos de emergência cadastrados. _(gap conhecido — ver "Gaps
conhecidos" abaixo)_

RF20 – O aplicativo deve permitir o registro de check-in e check-out do
cuidador na residência da pessoa cuidada, por geolocalização.

RF21 – O aplicativo deve redirecionar o usuário para uma tela de
escolha/criação de perfil quando a conta autenticada não possuir nenhum
perfil do tipo exigido pela rota acessada. _(gap conhecido — ver "Gaps
conhecidos" abaixo)_

---

## 2. Requisitos não funcionais

RNF01 – O aplicativo deve ser desenvolvido em React Native com Expo
(managed workflow), garantindo compatibilidade com Android e iOS a partir
de uma única base de código.

RNF02 – O aplicativo deve ser desenvolvido em TypeScript, dado o volume de
dados de saúde e permissões granulares por perfil.

RNF03 – Para funcionamento do sistema será necessário acesso à internet de
boa qualidade, com cache local de dados via TanStack Query para reduzir
impacto de conexões instáveis.

RNF04 – A interface do aplicativo deverá ser simples e intuitiva, com
atenção especial à acessibilidade para usuários idosos (fontes grandes,
alto contraste). Ver `docs/design/design-system.md` seção 8
("Acessibilidade — não-negociável") para os requisitos concretos (toque
mínimo 48×48px, contraste AA/AAA, nunca comunicar estado só por cor).

RNF05 – O aplicativo deve estar disponível 24 horas.

RNF06 – O aplicativo é disponibilizado de forma gratuita para pessoa
cuidada e responsável, podendo cobrar taxa de serviço do cuidador.

RNF07 – O aplicativo deve utilizar EAS Build com dev client desde o início
do projeto, dado que funcionalidades como câmera, GPS e push exigem
dispositivo real. _(implementado — `expo-dev-client` já é plugin do
projeto; ver `dev-workflow.md`)_

RNF08 – O aplicativo terá autenticação com senha e verificação de telefone
(SMS/OTP) para os usuários, gerenciada por um provedor de autenticação
global e único por conta. _(a verificação de telefone real ainda não
existe — o fluxo de Cuidador tem uma versão mockada com código de teste
fixo, ver `features/caregiver-onboarding.md`)_

RNF09 – O aplicativo deve manter apenas uma sessão ativa por conta,
independentemente de quantos perfis (Cuidador/Pessoa cuidada/Responsável)
estejam vinculados a ela. _(implementado — `AuthProvider`, ver
`architecture.md`)_

RNF10 – O aplicativo deve criptografar dados sensíveis de saúde, em
conformidade com a LGPD.

RNF11 – A camada de comunicação com o backend deve ser isolada em um
client único (`src/shared/api/client.ts`), de forma que a troca de
provedor de backend não exija reescrita das telas ou features.
_(implementado como factory — `createApiClient()` — nenhuma instância
global ainda exportada, porque o backend não foi escolhido; ver
`architecture.md` seção "Camada de dados")_

RNF12 – O código deve ser organizado por domínio de produto
(feature-based), permitindo que múltiplos times evoluam features
(cadastro, busca, chat, remédios, agenda, avaliações) em paralelo sem
conflito de código. _(implementado — `src/features/<feature>/`, ver
`architecture.md`)_

RNF13 – O projeto deve manter cobertura de testes automatizados de
componentes e hooks via Jest e React Native Testing Library, com
lint/format automático no commit (ESLint, Prettier, Husky/lint-staged).
_(implementado — ver `conventions.md` seção Testes)_

---

## 3. Regras de negócio

NEG01 – Apenas usuários que passarem pela verificação de identidade e
antecedentes podem ser listados como cuidadores nas buscas.

NEG02 – Usuários responsáveis somente poderão vincular uma pessoa cuidada
mediante aceite/consentimento dela, quando esta possuir capacidade civil.

NEG03 – Os tipos de perfil serão: Cuidador, Pessoa cuidada e Responsável,
podendo uma mesma conta acumular mais de um perfil simultaneamente, sem
necessidade de contas separadas. _(implementado — ver `ProfileType` em
`src/features/auth/store/useActiveProfileStore.ts`)_

NEG04 – O pagamento do serviço de cuidado é combinado e realizado
diretamente entre cuidador e família, fora do aplicativo.

NEG05 – Apenas cuidadores com selo de "verificado" podem aparecer nos
resultados de busca e receber contato de novas famílias.

NEG06 – O acesso às rotas exclusivas de cada perfil (Cuidador ou
Família/Pessoa cuidada) é condicionado à existência desse tipo de perfil
vinculado à conta autenticada; caso contrário, o usuário é redirecionado
para a tela de escolha de perfil. _(parcialmente implementado — ver "Gaps
conhecidos" abaixo)_

---

## Gaps conhecidos (requisito descreve o alvo, código ainda não chega lá)

- **RF19 (SOS) e RF10 (chat)** — nenhum dos dois existe ainda. `(shared)`
  é o grupo de rota correto pra ambos quando forem construídos (acessível
  de qualquer perfil ativo, sem guard próprio).
- **RF21 / NEG06 (redirecionar pra escolha de perfil)** — hoje
  `useProfileGuard` (`src/features/auth/guards/useProfileGuard.ts`)
  redireciona pra `/(auth)` (a Splash) quando o perfil exigido não existe
  na conta, não pra uma tela de escolha de perfil dedicada — porque essa
  tela (`profile-choice.tsx`) foi removida quando o fluxo virou "login
  único → Home direto" (ver `features/auth-flow.md`). Hoje "ativar um
  perfil" acontece a partir de um CTA na Home (`app/(shared)/home.tsx`),
  não de uma tela de escolha centralizada. Quando esse fluxo for revisado,
  o guard provavelmente deveria redirecionar pra `/(shared)/home` em vez
  de `/(auth)`, já que a Home é hoje o único lugar que oferece "ativar
  perfil". Decisão consciente de não mexer nisso agora — ver
  `docs/superpowers/specs/2026-08-17-unified-home-design.md` pro contexto
  de por que a escolha de perfil saiu do caminho principal.
