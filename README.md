# Transfers

Test assignment for the Frontend Developer position at Collaborator.pro.

Demo: https://soularis109.github.io/transfers/

## Stack

- Vite
- React 19 + TypeScript
- Redux Toolkit + React Redux
- SCSS (sass-embedded)
- Stylelint (stylelint-config-standard-scss)
- Vitest + Testing Library (react, jest-dom, user-event)
- Prettier

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `npm run dev`             | Start the dev server      |
| `npm run build`           | Production build          |
| `npm run preview`         | Preview the build locally |
| `npm run lint`            | Lint code                 |
| `npm run lint:styles`     | Lint styles (SCSS)        |
| `npm run lint:styles:fix` | Lint styles with autofix  |
| `npm run format`          | Format code with Prettier |
| `npm test`                | Run tests (Vitest)        |
| `npm run test:watch`      | Run tests in watch mode   |

## Solution

Stack: React 19 + TypeScript, Redux Toolkit (filtering/sorting/
pagination computed in memoized `createSelector`s, not in components),
Vite, SCSS (BEM, only `@use`/`@forward`, no `@import`) with stylelint
(`stylelint-config-standard-scss` + a custom `selector-class-pattern`
for BEM), Vitest + Testing Library for unit tests.

Architecture — Feature-Sliced Design with no exceptions: `entities/ticket/model`
does not depend on any `features/*`, and ticket domain logic
(`getTicketStopsCount`, `checkTicketStopsConsistency`) lives in
`entities/ticket/lib`, not in the domain-agnostic `shared`. Combined
selectors that merge entity state with several feature selectors
(`selectFilteredSortedTickets`, `selectVisibleTickets`, etc.) live in
`widgets/tickets-board` — the layer that composes them.

### Running locally

```bash
npm install
npm run dev            # dev server
npm test                # tests (Vitest)
npm run lint:styles     # SCSS lint (stylelint)
npm run lint            # code lint (oxlint)
npm run build            # production build
```

### Live demo

https://soularis109.github.io/transfers/
