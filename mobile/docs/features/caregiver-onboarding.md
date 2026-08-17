# Verificação de Cuidador (`app/(caregiver-onboarding)/*`)

Fluxo de "tornar-se Cuidador" — verificação de identidade estilo
fintech/banco. **Totalmente mockado**: nenhuma integração real (OCR,
reconhecimento facial, SMS, e-mail, backend, regra de aprovação). Existe
para validar a experiência visual antes de qualquer integração real —
ver `docs/product/vision.md` seção "Cuidador" para o que essas
integrações serão de verdade quando entrarem.

## Por que é um grupo de rota próprio, sem guard

`app/(caregiver-onboarding)` não é filho de `(auth)` nem tem
`useProfileGuard` — o usuário passando por ele ainda **não é** Cuidador
(é exatamente isso que ele está tentando se tornar), então nenhum dos
guards existentes se aplica. É alcançável a partir da Home (CTA "Quero ser
cuidador") independente de qual perfil está ativo no momento.

## Fluxo (11 telas)

```
intro
  → document-type (RG / CNH / Outro)
  → document-capture (frente+verso se RG/CNH, só frente se Outro)
  → phone → phone-verify
  → email → email-verify
  → facial-intro → facial-capture
  → review (resumo, "Editar" volta pra cada etapa)
  → conclusion (status: sempre "em análise" no fluxo mockado)
```

Progresso mostrado como "Etapa X de 5" — intro e conclusion não contam
(são telas de entrada/saída, não uma etapa de coleta de dado).

## Estado compartilhado

`src/features/caregiver-onboarding/store/useCaregiverVerificationStore.ts`
(Zustand) guarda tudo que as telas precisam ler entre si — principalmente
para a tela `review` montar o resumo. Chame `.reset()` ao sair do fluxo
(feito em `conclusion.tsx` no botão "Voltar para o início") para não
vazar estado mockado pra uma próxima tentativa.

## Como as capturas são simuladas

`document-capture.tsx` e `facial-capture.tsx` seguem a mesma máquina de
estados: `pending → capturing (auto, ~900ms) → analyzing (para, espera
ação)`. Em vez de resolver sozinho pra "aprovado" depois de analyzing (o
que tornaria o estado de erro quase impossível de ver na prática), a tela
espera confirmação:

- Botão principal em `analyzing` vira "Simular aprovação" → estado final
  de sucesso.
- Um link secundário "Simular reprovação/falha (teste)" força o estado de
  erro, pra dar pra revisar esse visual sob demanda.

Isso é intencional — não é um estado real de análise assíncrona, é uma
forma de deixar todos os estados visuais (pendente/capturando/analisando/
sucesso/inválido) alcançáveis durante revisão de design.

## Código de teste do OTP

`phone-verify.tsx` e `email-verify.tsx` aceitam qualquer 6 dígitos como
input, mas só `123456` conta como código correto — e isso é mostrado na
própria tela ("Protótipo: use o código 123456") pra não travar quem está
testando. Reenvio tem cooldown mockado de 30s.

## Componentes de apoio (`src/features/caregiver-onboarding/components/`)

- `VerificationStepHeader` — back + "Etapa X de Y" + barra de progresso.
  Reaproveitável por qualquer fluxo multi-etapa futuro parecido com este.
- `VerificationStatusBadge` — badge de estado (ícone + label + tom de cor),
  usado nas telas de captura.
- `SelectableRow` — card de seleção com rádio, usado em `document-type`.

## Entrada a partir da Home

O CTA "Quero ser cuidador" vive na Home (`app/(shared)/home.tsx`) — ver
`home.md` quando existir. Pra abrir o fluxo direto sem passar pela Home
(útil em dev, já que a Home ainda não tem sessão real): `xcrun simctl
openurl booted "cuidamais://(caregiver-onboarding)/intro"`.
