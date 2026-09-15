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

| Команда                   | Опис                       |
| ------------------------- | -------------------------- |
| `npm run dev`             | Запуск дев-сервера         |
| `npm run build`           | Продакшн-збірка            |
| `npm run preview`         | Перегляд збірки локально   |
| `npm run lint`            | Лінт коду                  |
| `npm run lint:styles`     | Лінт стилів (SCSS)         |
| `npm run lint:styles:fix` | Лінт стилів з автофіксом   |
| `npm run format`          | Форматування коду Prettier |
| `npm test`                | Запуск тестів (Vitest)     |
| `npm run test:watch`      | Тести у watch-режимі       |

## Рішення

Стек: React 19 + TypeScript, Redux Toolkit (фільтрація/сортування/
пагінація рахуються в мемоізованих `createSelector`, а не в компонентах),
Vite, SCSS (BEM, лише `@use`/`@forward`, без `@import`) зі stylelint
(`stylelint-config-standard-scss` + кастомний `selector-class-pattern`
під BEM), Vitest + Testing Library для юніт-тестів.

Свідомі відхилення від Feature-Sliced Design, проговорені окремо в
процесі розробки:

- `entities/ticket/model/selectors.ts` імпортує селектори з
  `features/stops-filter`, `features/tickets-sort` і
  `features/tickets-pagination`, щоб мати єдину точку combined-селектора
  над кількома зрізами стану (порушує формальний напрямок залежностей
  FSD "нижчий шар не знає про вищий").
- `shared/lib/ticketStops.ts` імпортує типи `Ticket`/`StopsCount` з
  `entities`, бо сигнатура хелпера (`(ticket: Ticket) => StopsCount`)
  цього прямо вимагає.
- `features/stops-filter/model` (`filterSlice.ts`, `selectors.ts`) та
  `features/tickets-pagination/model/paginationSlice.ts` імпортують
  константи (`STOPS_OPTIONS`, `PAGE_SIZE`) з публічного бареля
  `entities/ticket/model` — у поєднанні з першим пунктом це замикає
  двонапрямлену залежність `entities/ticket/model` ↔
  `features/stops-filter/model` і `entities/ticket/model` ↔
  `features/tickets-pagination/model` на рівні модульного графа.
  Перевірено, що це безпечно: `types.ts` (звідки й походять ці
  константи) не має власних залежностей, тому завантажується першим
  незалежно від циклу, а `PAGE_SIZE`/`STOPS_OPTIONS` вже мають значення
  до того, як їх читає будь-який модуль у цій парі — підтверджено
  тестами (`paginationSlice.test.ts` явно перевіряє початковий
  `visibleCount = PAGE_SIZE`) і відсутністю попереджень про циклічні
  залежності в prod-білді (Rollup). Свідомий вибір на користь єдиного
  публічного API слайсу замість формальної відсутності циклів.

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
