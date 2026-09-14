# Transfers

Тестове завдання на позицію Frontend Developer для Collaborator.pro.

Демо: https://soularis109.github.io/transfers/

## Стек

- Vite
- React 19 + TypeScript
- Redux Toolkit + React Redux
- SCSS (sass-embedded)
- Stylelint (stylelint-config-standard-scss)
- Vitest + Testing Library (react, jest-dom, user-event)
- Prettier

## Розробка

```bash
npm install
npm run dev
```

## Скрипти

| Команда | Опис |
| --- | --- |
| `npm run dev` | Запуск дев-сервера |
| `npm run build` | Продакшн-збірка |
| `npm run preview` | Перегляд збірки локально |
| `npm run lint` | Лінт коду |
| `npm run lint:styles` | Лінт стилів (SCSS) |
| `npm run lint:styles:fix` | Лінт стилів з автофіксом |
| `npm run format` | Форматування коду Prettier |
| `npm test` | Запуск тестів (Vitest) |
| `npm run test:watch` | Тести у watch-режимі |

## Рішення

Стек: React 19 + TypeScript, Redux Toolkit (фільтрація/сортування/
пагінація рахуються в мемоізованих `createSelector`, а не в компонентах),
Vite, SCSS (BEM, лише `@use`/`@forward`, без `@import`) зі stylelint
(`stylelint-config-standard-scss` + кастомний `selector-class-pattern`
під BEM), Vitest + Testing Library для юніт-тестів.

Два свідомих відхилення від Feature-Sliced Design, проговорені окремо в
процесі розробки: `entities/ticket/model/selectors.ts` імпортує селектори
з `features/stops-filter` і `features/tickets-sort`, щоб мати єдину точку
combined-селектора над кількома зрізами стану (порушує формальний
напрямок залежностей FSD "нижчий шар не знає про вищий"); а
`shared/lib/ticketStops.ts` імпортує типи `Ticket`/`StopsCount` з
`entities`, бо сигнатура хелпера (`(ticket: Ticket) => StopsCount`) цього
прямо вимагає.

### Запуск локально

```bash
npm install
npm run dev            # дев-сервер
npm test                # тести (Vitest)
npm run lint:styles     # лінт SCSS (stylelint)
npm run lint            # лінт коду (oxlint)
npm run build            # продакшн-збірка
```

### Живий приклад

https://soularis109.github.io/transfers/
