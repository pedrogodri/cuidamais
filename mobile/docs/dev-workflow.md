# Workflow de desenvolvimento

## Comandos

Rodar todos a partir de `mobile/`:

| Comando             | O que faz                                                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`      | ESLint (`eslint-config-expo` + prettier), flat config desligado via `ESLINT_USE_FLAT_CONFIG=false`                                                                   |
| `npm run format`    | Prettier em todo o projeto                                                                                                                                           |
| `npm run typecheck` | `tsc --noEmit`                                                                                                                                                       |
| `npm test`          | Jest + React Native Testing Library — **use este script**, não `npx jest` direto (ver `conventions.md`, seção Testes, sobre a flag `NODE_OPTIONS` que ele já inclui) |
| `npm start`         | `expo start` — só bundler, sem build nativo                                                                                                                          |
| `npm run ios`       | `expo run:ios` — build nativo + instala no simulador                                                                                                                 |
| `npm run android`   | `expo run:android`                                                                                                                                                   |

Para rodar um teste específico: `npx jest caminho/do/Arquivo.test.tsx`
(mantendo a env var: `NODE_OPTIONS=--no-experimental-webstorage npx jest ...`).

## Build nativo no iOS (dev client)

O projeto usa `expo-dev-client` desde o início (não roda no Expo Go — vários
módulos nativos exigem build custom). `npm run ios` faz:

1. `expo prebuild` (só na primeira vez, se `ios/` não existir) — gera o
   projeto Xcode a partir de `app.json` + `assets/`.
2. `pod install`.
3. `xcodebuild` + instala no simulador.

O primeiro build demora bastante (Pods + toda a árvore de módulos nativos,
reanimated em especial tem centenas de arquivos C++). Builds seguintes são
incrementais e bem mais rápidos — **exceto quando `ios/` foi regenerado**
(ver gotcha abaixo).

### Gotcha: mudar `app.json` ou assets nativos não basta

`expo prebuild` só roda automaticamente quando a pasta `ios/` (ou
`android/`) **não existe ainda**. Depois da primeira vez, ela vira uma pasta
gerada normal — editar `app.json` (ícone, splash, adaptive icon, plugins) ou
trocar os arquivos em `assets/` **não se propaga sozinho** pro projeto
nativo já gerado. Sintoma: você troca `assets/icon.png`, builda de novo, e o
ícone antigo continua aparecendo.

Fix: regenerar o projeto nativo antes de buildar de novo:

```bash
npx expo prebuild --clean -p ios   # ou -p android
npm run ios
```

Isso reescreve `ios/` do zero a partir da config atual — é seguro, é pasta
gerada (git-ignorada), mas o próximo build volta a ser um build "completo"
(mais lento).

## Estado de navegação persistido em dev

Expo Router persiste a árvore de navegação em dev (AsyncStorage) pra
sobreviver a Fast Refresh sem perder onde você estava. Isso significa que
relançar o app (`simctl launch` de novo, ou reabrir depois de trocar de
app) pode **retomar numa rota anterior** em vez de reiniciar em
`/(auth)`. Não é um bug de navegação do app — é esperado só em dev. Pra
testar do zero, force uma rota explícita:

```bash
xcrun simctl openurl booted "cuidamais://onboarding"
```

(troque `onboarding` pela rota que quiser testar; grupos de rota como
`(auth)` não aparecem na URL).

## Assets de ícone/splash

Se for trocar a logo do app, os cinco arquivos em `assets/` têm requisitos
diferentes de tamanho/transparência/padding — não é só substituir o PNG:

| Arquivo                       | Tamanho   | Transparência      | Observação                                                                                                                  |
| ----------------------------- | --------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `icon.png`                    | 1024×1024 | Não (fundo sólido) | Ícone principal iOS                                                                                                         |
| `favicon.png`                 | 48×48     | Sim                | Web                                                                                                                         |
| `splash-icon.png`             | 1024×1024 | Sim                | Precisa ser uma versão **clara** (a splash nativa usa fundo `petrol-500` escuro — mark escuro fica invisível)               |
| `android-icon-foreground.png` | 1024×1024 | Sim                | Conteúdo precisa caber dentro de ~60% central (safe zone do ícone adaptativo — launchers recortam em círculo/squircle/etc.) |
| `android-icon-monochrome.png` | 432×432   | Sim                | Silhueta branca lisa (Android 13+ retinta com a cor do sistema)                                                             |

`app.json` usa `android.adaptiveIcon.backgroundColor` (não
`backgroundImage`) — mais simples que manter um sexto arquivo de fundo.
