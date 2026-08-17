# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Run from `mobile/`:

- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Jest + React Native Testing Library (use this script, not `npx jest` directly — see `docs/conventions.md`)
- `npm run format` — Prettier
- `npm run ios` / `npm run android` — native dev-client build + install on simulator/emulator

Single test file: `npx jest path/to/File.test.tsx` (needs `NODE_OPTIONS=--no-experimental-webstorage`, already set inside `npm test`).

## Architecture and conventions

Deep-dive docs, read the relevant one before working in that area:

- `docs/architecture.md` — feature-based folder structure, session vs. active-profile model, route guards, data layer, navigation groups.
- `docs/conventions.md` — component/design-token conventions, safe-area handling, testing patterns (including an RTL `await` gotcha).
- `docs/reanimated-and-motion.md` — `react-native-reanimated` usage patterns and two version-specific gotchas (`scrollTo` needing `runOnUI`, `entering`/`exiting` Layout Animations crashing).
- `docs/dev-workflow.md` — native build workflow, the `expo prebuild` gotcha after changing `app.json`/assets, dev-only navigation-state persistence, icon/splash asset specs.

Feature/flow docs — what a specific screen flow does, what's real vs.
mocked, decisions and gotchas specific to it (not general conventions):

- `docs/features/auth-flow.md` — Splash → Onboarding → Signup → Home, what
  got removed (profile-choice) and what still uses the leftover pieces.
- `docs/features/caregiver-onboarding.md` — the 11-screen mocked identity
  verification flow, its state machine, the OTP test code.
- `docs/features/home.md` — the unified Home screen, how it adapts to the active profile, what's mocked.

Visual design system (colors, typography, spacing, component specs) lives at
`docs/design/design-system.md`.

Full product vision (every planned feature, by area and by profile, across
mobile and backoffice — not all of it built yet) lives at
`../docs/product/vision.md`. Its "Sugestão de ordem de construção" section
is the build order; don't assume a listed feature exists without checking
the code.

## Keeping these docs current

This doc set is meant to grow with the project, not stay frozen at whatever
existed when it was written.

- Before working in an area, check the list above for a doc that covers it
  and read it first.
- When you build a new module/feature area, or hit a real gotcha (something
  that cost real debugging time, a library quirk, a non-obvious pattern),
  write it down before moving on — either update the relevant existing doc
  or create `docs/<area>.md` if none covers it. Don't let the lesson live
  only in that conversation's history.
- One file per architectural concern or per screen flow (e.g. the whole
  auth flow, the whole caregiver-verification flow), not one per
  individual source file — match the density of the existing docs: gotchas
  and the "why" over generic description, short code examples for
  non-obvious patterns, no restating what's already obvious from reading
  the file. Screen-flow docs go in `docs/features/`.
- Add every new doc file to the list above so it's actually discoverable —
  a doc nobody points to might as well not exist.
- If code changes make a doc inaccurate (renamed function, changed pattern,
  a gotcha that got fixed upstream), correct it in the same change that
  caused the drift, not later.
