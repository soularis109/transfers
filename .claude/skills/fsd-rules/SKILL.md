---
name: fsd-rules
description: Правила Feature-Sliced Design для цього проєкту — шари, напрямок імпортів, публічний API через барелі, що можна і чого не можна на кожному шарі. Використовуй при будь-якому аналізі структури, переміщенні файлів, створенні нових модулів або рев'ю імпортів.
---

# FSD у цьому проєкті

## Шари, згори вниз

```
app/        store, Provider, глобальні стилі, точка входу
pages/      сторінки, збирають widgets/features/entities
widgets/    самостійні композитні блоки UI (tickets-board)
features/   дії користувача зі своїм станом (stops-filter, tickets-sort, tickets-pagination)
entities/   бізнес-сутності (ticket): типи, модель, presentational UI
shared/     переюзабельне без знання про домен: ui-кіт, хелпери, стилі, асети
```

## Головне правило напрямку

Шар може імпортувати **тільки з шарів, що нижче за нього**. Ніколи навпаки, ніколи вбік
(крім задокументованого винятку нижче).

| Шар | Може імпортувати з | НЕ може імпортувати з |
|---|---|---|
| `app` | pages, widgets, features, entities, shared | — |
| `pages` | widgets, features, entities, shared | app |
| `widgets` | features, entities, shared | app, pages |
| `features` | entities, shared | app, pages, widgets, інші features |
| `entities` | shared | app, pages, widgets, features |
| `shared` | нічого з проєкту | геть усе вище |

Найчастіші реальні порушення, які треба шукати в першу чергу:

1. Файл у `shared/` імпортує тип або константу з `entities/` — це найпоширеніша
   помилка, бо здається невинною («це ж просто тип»).
2. Файл у `entities/` імпортує селектор або екшен з `features/`.
3. Дві `features/` імпортують одна одну напряму замість того, щоб винести спільне
   в `entities/` або `shared/`.
4. Будь-що імпортує з `pages/`.

## Задокументовані винятки саме цього проєкту

Один тип порушення є **свідомим**:

1. Type-only імпорт `RootState`/`AppDispatch` з `@/app/store` у файлах
   `entities`/`features`/`widgets` (включно з `shared/lib/store/hooks.ts`).
   Причина: `RootState` неможливо визначити нижче за `app/`, де збирається
   `configureStore` з усіх зрізів; типи стираються на компіляції й не
   створюють рантайм-звʼязку із шаром `app`.

Якщо знаходиш **інші** порушення — це справжні знахідки, про них треба доповідати.
Якщо знаходиш це — просто зазнач, що воно задокументоване, і йди далі.

Для контрасту: `shared/lib/pluralizeStops.ts` навмисно має сигнатуру `(count: number)`,
а не `(ticket: Ticket)` — саме щоб НЕ тягнути доменний тип у shared. Це зразок того,
як треба проєктувати сигнатури в `shared/`.

## Публічний API через барелі

Кожен слайс (`features/stops-filter`, `entities/ticket`, ...) має `index.ts`, який
реекспортує **тільки те, що потрібно ззовні**: екшени, селектори, публічні типи,
головний UI-компонент.

```ts
// ✅ правильно — імпорт ззовні йде через барель
import { toggleStop, selectSelectedStops } from '@/features/stops-filter';

// ❌ неправильно — прямий шлях у нутрощі слайсу
import { toggleStop } from '@/features/stops-filter/model/filterSlice';
```

Внутрішні хелпери, які не потрібні ззовні, **не** експортуються з бареля.
Наприклад `getTotalDuration` у `comparators.ts` — приватна деталь реалізації
одного файлу, її не треба ні виносити в `shared/lib`, ні реекспортувати.

Усередині одного слайсу відносні імпорти (`./model/filterSlice`) — нормально.

## Сегменти всередині слайсу

```
features/stops-filter/
  index.ts        публічний API слайсу
  model/          slice, селектори, чиста логіка, тести
  ui/             presentational-компоненти + .scss
```

`ui/` не має містити бізнес-логіки: жодних обчислень, фільтрацій, форматувань
безпосередньо в JSX. Усе готове приходить з `model/` (через селектор) або з
`shared/lib` (через хелпер-форматер).

## Як перевіряти

```bash
# імпорти з features всередині entities
rg "from '.*features/" src/entities

# імпорти будь-чого з проєкту всередині shared
rg "from '.*(entities|features|widgets|pages|app)/" src/shared

# прямі імпорти в нутрощі слайсів в обхід барелів
rg "from '.*(features|entities)/[a-z-]+/(model|ui)/"
```

Завжди перевіряй результат очима: `rg` дає кандидатів, а не вирок.
