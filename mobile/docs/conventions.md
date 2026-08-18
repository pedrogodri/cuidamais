# Convenções de código — CuidaMais mobile

Como escrever componentes, telas e testes neste projeto. Para os tokens de
design em si (cores, tipografia, espaçamento), veja
`design/design-system.md` — aqui é sobre como esses tokens viram
código.

## Componentes

- Function component, `export function Nome(...)` nomeada — sem
  `export default` em componentes de `src/` (só rotas em `app/` usam default
  export, porque o Expo Router exige).
- Props tipadas com `interface NomeProps`, declarada logo acima do
  componente.
- Sem comentários de cabeçalho, sem JSDoc decorativo. Um comentário só existe
  quando explica um porquê não óbvio (ver exemplos em `Button.tsx` sobre a
  regra de contraste do amber, ou em `onboarding.tsx` sobre o `scrollTo`).

## Design tokens em código

`tailwind.config.js` estende as classes do NativeWind com os tokens do
design system:

- Cores: `petrol-{500,700,100}`, `amber-{500,700,100}`, `vinculo-{500,700,100}`,
  `success-*`, `error-*`, `info-*`, `neutral-{0,50,100,200,300,500,700,900}`.
  Use sempre a classe (`bg-petrol-500`), nunca hex direto no JSX.
- **Espaçamento não tem tokens próprios** — a escala numérica padrão do
  Tailwind (`p-4`, `gap-6`, `pt-8`, `pt-16`...) já bate 1:1 com os
  `space-N` do design system (ambos em base 4px), então `p-4` = `space-4` =
  16px. Não invente valores arbitrários (`pt-[13px]`) fora dessa escala.
- `rounded-sm/md/lg/pill` foram redefinidos para 10/16/24/999px (o padrão do
  Tailwind foi sobrescrito de propósito — não são os valores originais dele).
- Fontes: `font-display` (Bricolage SemiBold), `font-display-medium`,
  `font-body`, `font-body-medium`, `font-body-semibold`, `font-mono`.
  Tamanhos com line-height já embutido: `text-display/h1/h2/h3/body-lg/body/
caption/overline`.
- Cores, elevação (sombra) e mapeamentos que precisam de valor JS puro (não
  className) ficam em `src/shared/ui/theme.ts` — ex: `elevation.e1/e2/e3`
  para `style` de cards elevados, ou cor hex para passar a um ícone
  (`Ionicons color=...` não aceita className).

## Tipografia

Não use `<Text>` cru para texto de conteúdo — use os componentes de
`src/shared/ui/Typography.tsx` (`Display`, `H1`, `H2`, `H3`, `BodyLarge`,
`Body`, `Caption`, `Overline`). Todos aceitam `className` extra que é
concatenado por cima do estilo base, então dá pra sobrescrever cor pontual
(`<H1 className="text-center">`).

## Botão

`src/shared/ui/Button.tsx` tem duas dimensões independentes:

- `variant`: `'primary'` (fundo sólido) | `'secondary'` (outline).
- `tone`: `'petrol' | 'amber' | 'vinculo'` — de qual família de cor o botão
  puxa. Use `getProfileButtonTone(profileType)` de
  `src/features/auth/theme/profileTheme.ts` para derivar o tone a partir do
  perfil ativo, não hardcode.

O componente já resolve a regra de contraste do design system internamente
(amber nunca leva texto branco, vinculo preenchido usa `-700` em vez de
`-500`) — não reimplemente essa lógica no call site.

## Campo de formulário

`src/shared/ui/TextField.tsx` sempre renderiza o `label` como texto visível
acima do input (nunca só placeholder — regra de acessibilidade do design
system). `isPassword` liga o toggle de mostrar/ocultar senha automaticamente.
`error` mostra ícone + mensagem abaixo do campo, nunca só a borda vermelha.

## Perfis e cor por contexto

`src/features/auth/theme/profileTheme.ts` é a fonte única de verdade para
"qual cor/ícone/label esse tipo de perfil usa". Não duplique esse mapeamento
em outro lugar — importe `getProfileTheme`, `getProfileButtonTone` ou
`parseProfileType` (para ler o parâmetro de rota `profile` com segurança,
com fallback para `'caregiver'`).

## Safe area

Nunca chute padding de topo/rodapé (`pt-24`, `pb-10` fixos) para escapar do
notch/status bar/home indicator — isso quebra em telas com safe area
diferente. Use sempre `useSafeAreaInsets()` de
`react-native-safe-area-context` e componha o padding real:

```tsx
const insets = useSafeAreaInsets();
// ...
<View style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }}>
```

`SafeAreaProvider` já envolve o app inteiro em `app/_layout.tsx` — não
precisa adicionar de novo em cada tela.

## Ícones

`@expo/vector-icons` (`Ionicons`), não outra lib de ícones. Tamanho padrão
20/24px inline, 24px para ações de UI — segue a escala do design system.

## Alias de import

`@/*` aponta para `src/*` (configurado em `tsconfig.json`). Use sempre o
alias em vez de caminho relativo saindo de `app/` ou entre features
diferentes dentro de `src/`.

## Testes

- Colocados ao lado do arquivo testado (`Button.tsx` + `Button.test.tsx`),
  nunca em pasta `__tests__` separada.
- **Telas em `app/` também seguem "teste ao lado do arquivo"** (ex:
  `app/(shared)/home.tsx` + `home.test.tsx`, `app/(auth)/login.tsx` +
  `login.test.tsx`). Isso funciona apesar de o Expo Router varrer todo
  arquivo em `app/` como rota em potencial e o Metro tentar empacotar tudo
  que um `.test.tsx` importa no bundle nativo real — inclusive
  `@testing-library/react-native`, que importa o módulo `console` do Node
  (não existe no runtime RN) e quebraria o build com "iOS Bundling failed"
  / "attempted to import the Node standard library module" — porque
  `metro.config.js` tem um `resolver.blockList` que exclui
  `/\.test\.[jt]sx?$/` do bundle nativo. O Jest (que usa `jest.config.js`,
  não o Metro) ignora esse blockList e continua achando e rodando esses
  testes normalmente.
- `@testing-library/react-native` nesta versão exige `await` em operações
  assíncronas que antes eram síncronas noutras versões: **`await
render(...)`** e **`await fireEvent.press(...)` /
  `await fireEvent.changeText(...)`**. Esquecer o `await` no `fireEvent` faz
  o teste passar silenciosamente sem realmente disparar o handler (a Promise
  fica pendente) — se um teste de interação estiver "passando" mas o
  comportamento não mudou, confira primeiro se falta esse `await`.
- Mocke módulos nativos com `jest.mock('nome-do-modulo')` (ver
  `AuthProvider.test.tsx` mockando `expo-secure-store`).
- **Overlay com `Modal` + `measureInWindow` funciona em teste sem mock,
  mas com uma pegadinha**: o `Modal` do React Native renderiza seus filhos
  normalmente no ambiente de teste (RNTL não faz portal real, então
  `getByRole`/`getByText` acham o conteúdo do Modal igual a qualquer outro
  `View`). Já `ref.measureInWindow(callback)` não invoca o callback nesse
  ambiente (não há layout nativo real pra medir) — se abrir o overlay
  depender de esperar por esse callback, o teste trava. Padrão usado em
  `ProfileSwitcherDropdown.tsx`: abrir o overlay (`setIsOpen(true)`) de
  forma síncrona no `onPress`, e chamar `measureInWindow` só pra
  atualizar a posição visual depois, com um valor de fallback já definido
  no estado inicial — assim o componente abre e funciona no teste mesmo
  quando a medição nunca resolve.
- Rode a suíte com `npm test` (não `npx jest` direto) — o script já inclui a
  flag `NODE_OPTIONS=--no-experimental-webstorage` necessária neste
  ambiente/versão do Node; sem ela alguns testes falham com
  `SecurityError: Cannot initialize local storage without a
--localstorage-file path`, que não tem relação com o código sendo testado.
