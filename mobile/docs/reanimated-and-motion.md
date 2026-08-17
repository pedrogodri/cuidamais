# Animação — react-native-reanimated

`react-native-reanimated` (v4) e `react-native-worklets` já estão instalados
e o plugin Babel é incluído automaticamente pelo `babel-preset-expo` — não é
preciso adicionar `react-native-reanimated/plugin` em `babel.config.js` à
mão.

Princípio de movimento do design system: transições de 250–300ms, easing
`ease-out`, **sem spring/bounce** (ver seção 9 de `design-system.md`). Toda
animação abaixo deve respeitar isso.

## `scrollTo` precisa rodar na UI thread

`scrollTo(animatedRef, x, y, animated)` chamado direto de um handler comum
(`onPress` de um `Pressable`) **não faz nada, silenciosamente** — sem erro,
sem warning. Internamente, `dispatchCommand` (que `scrollTo` usa por baixo)
tem essa checagem:

```ts
if (globalThis.__RUNTIME_KIND === RuntimeKind.ReactNative) {
  return; // no-op se não estiver rodando na UI/worklet runtime
}
```

Um `onPress` roda na JS runtime normal, não na UI runtime — então a checagem
sempre bate e a função sai sem fazer nada. O padrão correto é envolver a
chamada com `runOnUI`:

```tsx
const scrollRef = useAnimatedRef<Animated.ScrollView>();

function handlePress() {
  const nextX = (activeIndex + 1) * SCREEN_WIDTH;
  runOnUI(() => {
    'worklet';
    scrollTo(scrollRef, nextX, 0, true);
  })();
}
```

Exemplo real em `app/(auth)/onboarding.tsx` (botão "Avançar" rolando pro
próximo slide).

## Layout Animations (`entering`/`exiting`) — evitar por enquanto

`FadeIn`/`FadeOut` e outras Layout Animations built-in (`entering`/`exiting`
em `Animated.View`) **crasham** na versão instalada
(`react-native-reanimated@4.5.1`) com o erro:

```
Render Error: Cannot create property 'reduceMotion' on number '1'
  at BaseAnimationBuilder.ts:151 (getDelayFunction)
```

Isso acontece mesmo em uso básico (`entering={FadeIn.duration(200)}`). Até
isso ser investigado/atualizado, **não use `entering`/`exiting`** para
crossfade de elementos condicionais. Alternativa que funciona: animar
opacidade manualmente com `useSharedValue` + `withTiming` (ou
`withSequence`) num `useAnimatedStyle`, disparado por `useEffect` reagindo à
condição:

```tsx
const opacity = useSharedValue(1);

useEffect(() => {
  opacity.value = withTiming(condition ? 1 : 0, {
    duration: 220,
    easing: Easing.out(Easing.ease),
  });
}, [condition, opacity]);

const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
```

Exemplo real: o fade do link "Pular" e o "flash" do botão primário/secundário
em `app/(auth)/onboarding.tsx` usam esse padrão em vez de `entering`/
`exiting`.

## Indicador de progresso ligado ao scroll (padrão `PageDots`)

Para um indicador que acompanha o scroll continuamente (não só troca no
`onMomentumScrollEnd`), passe o `SharedValue` de posição do scroll direto pro
componente filho e derive `width`/`backgroundColor` com `interpolate` /
`interpolateColor` dentro de um `useAnimatedStyle` por item — ver
`src/shared/ui/PageDots.tsx`. Isso evita re-render de todos os dots a cada
frame de scroll (o cálculo roda inteiro na UI thread).
