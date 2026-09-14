# Код-рев'ю: чеклист покращень

Звіт стороннього рев'ю перед здачею тестового завдання. Пункти нижче — робочий чеклист:
відмічаємо `[x]` по мірі виправлення. `✅ Гаразд` (без дій) винесено в кінець окремим списком
для довідки.

---

## ⚠️ Позаштатна знахідка (перевірити першою)

- [x] `src/shared/ui/LogoByCard/LogoByCard.tsx` був незакомічено змінений під час сесії рев'ю (`git
status` показував чисто на старті, зараз `M`). Новий варіант — сирий 90-рядковий inline
      SVG з Figma: `style="mask-type:luminance"` як **рядок** замість об'єкта
      `CSSProperties`, kebab-case атрибути (`fill-rule`, `clip-rule`, `stroke-width`,
      `color-interpolation-filters`), відсутні `className="logo"/"logo__icon"`, `aria-label`,
      обгортка-посилання. Якщо закомітити як є — зламає `tsc -b` і, відповідно, білд/деплой.
      **Дія:** звірити `git status`/`git diff -- src/shared/ui/LogoByCard/LogoByCard.tsx`; або відкотити
      до версії з HEAD, або доробити новий SVG коректно (camelCase-атрибути, `style` як
      об'єкт, повернути `className`/`aria-label`).
      **Виконано:** компонент видалено, `TicketCard` тепер рендерить реальний `<img>` з
      `shared/assets/images/a4e.webp` (з `alt`), дангл-імпорту немає, `tsc -b` проходить.

---

## 🔴 Критично

- [ ] **Живий демо-лінк повертає 404** — `https://soularis109.github.io/transfers/`
      (`curl -sI` → `HTTP/2 404`, `server: GitHub.com`), попри 5/5 зелених ранів
      `.github/workflows/deploy.yml`. Ймовірна причина: у Settings → Pages репозиторію
      `soularis109/transfers` джерело (Source) не перемкнене на **"GitHub Actions"**.
      **Дія:** Settings → Pages → Source = "GitHub Actions", перезапустити останній run
      (або зробити новий push). **Залишено вручну користувачу** — потребує доступу до
      Settings репозиторію на GitHub.

- [x] **TypeScript strict mode вимкнений** — ні `tsconfig.app.json`, ні `tsconfig.node.json`
      не мають `"strict": true` (і жодного з окремих строгих прапорів).
      **Дія:** додати `"strict": true` в `compilerOptions` обох файлів, прогнати
      `npm run build` і прибрати нові помилки типів, якщо з'являться.

- [x] **Фільтр пересадок не працює з клавіатури** —
      `src/features/stops-filter/ui/StopsFilterCard/StopsFilterCard.tsx:50-56`, `<li
role="checkbox" aria-checked={checked} onClick={...}>` без `tabIndex`/`onKeyDown`.
      **Дія:** або додати `tabIndex={0}` + `onKeyDown` (Space/Enter → `handleToggle`), або
      переписати на приховане нативне `<input type="checkbox">` + стилізований `<span>`.

---

## ⚠️ Варто виправити

- [x] **Prettier не застосований по всьому коду** — `npx prettier --check .` падає на 25
      файлах (здебільшого через відсутній `\n` в кінці файлу): майже всі `.ts/.tsx` у `src/`
      (`comparators.ts`, `store.ts`, `hooks.ts`, `StopsFilterCard.tsx`, `TicketsBoard.tsx`
      тощо), а також `README.md`, `tsconfig.json`, `.stylelintrc.json`.
      **Дія:** `npm run format`, закомітити.

- [x] **Недокументований feature→feature імпорт (FSD)** —
      `src/features/tickets-pagination/model/paginationSlice.ts:3-4` імпортує
      `toggleStop/selectAll/clearAll` з `stops-filter` і `setSort` з `tickets-sort`, склеюючи
      три незалежні фічі через `isAnyOf`-matcher (`paginationSlice.ts:24`). На відміну від
      двох задокументованих у README винятків, цей ніде не проговорений.
      **Дія:** або задокументувати як третій свідомий виняток у README, або скидати
      пагінацію через orchestration-рівень (`useEffect` у `TicketsBoard`/`HomePage`, що слухає
      фільтр/сорт і диспатчить `resetPagination()`), прибравши крос-імпорт actions.

- [x] **`selectIsAllStopsSelected` не мемоізований** —
      `src/features/stops-filter/model/selectors.ts:5-6`, `.every()` у звичайній функції, не
      в `createSelector` (на відміну від патерну в `entities/ticket/model/selectors.ts`).
      **Дія:** обгорнути в `createSelector`.

- [x] **"Всі" не відмічено на старті, хоча показує всі квитки** — дефолтний
      `selectedStops: []` (`filterSlice.ts:8`) трактується як "показати все", але
      `selectIsAllStopsSelected` при порожньому масиві повертає `false` → рядок "Всі" виглядає
      невідміченим.
      **Дія:** дефолтний `selectedStops: [0,1,2,3]` в `initialState`, або зробити
      `isAllSelected === true` також при порожньому масиві.

- [x] **`shared/lib/hooks.ts` імпортує типи з `app/store`** — `src/shared/lib/hooks.ts:3`,
      третій недокументований напрямок порушення FSD (type-only, тому некритично).
      **Дія:** згадати як третій задокументований виняток у README, або винести типізовані
      хуки в `app/`.

- [x] **`key={index}` замість стабільного ключа** —
      `src/entities/ticket/ui/TicketCard/TicketCard.tsx:21-22`, `segments.map((segment,
index) => ... key={index})`.
      **Дія:** `key={segment.origin + segment.destination}` або подібне.

- [x] **`fetchTickets` без guard від подвійного диспатчу в StrictMode** —
      `src/pages/home/HomePage.tsx:12-14`.
      **Дія:** диспатчити лише коли `status === 'idle'` (через `selectTicketsStatus`).

- [x] **Текст кнопки "ще 5" не завжди точний** —
      `src/widgets/tickets-board/ui/TicketsBoard/TicketsBoard.tsx:45-49`, жорстко "ще 5", хоча
      реально може додатись менше.
      **Дія:** `Math.min(PAGE_SIZE, filteredCount - visibleCount)` у тексті.

- [x] **`tickets-board__more` без SCSS-правила** — клас не стилізує нічого понад базовий
      `.button` (перевірено весь `TicketsBoard.scss`).
      **Дія:** прибрати клас або додати стиль.

- [x] **CI не запускає лінт коду** — `.github/workflows/deploy.yml` має `lint:styles` → `test`
      → `build`, без кроку `npm run lint` (oxlint).
      **Дія:** додати `- run: npm run lint` перед `Build`.

- [x] **`getTicketStopsCount` без тесту** — `src/shared/lib/ticketStops.ts` (з
      `console.warn` на розбіжність пересадок) не має `ticketStops.test.ts`.
      **Дія:** додати тест на розбіжність (spy на `console.warn`) і на збіг.

- [x] **Перевірка розбіжності пересадок рахується при кожному перерахунку фільтра** —
      викликається всередині `.filter()` у `selectFilteredSortedTickets`
      (`entities/ticket/model/selectors.ts:19`) замість одного разу при завантаженні даних.
      **Дія (опційно):** перенести перевірку інваріанту в `ticketsSlice.ts` одразу після
      `fetchTickets.fulfilled`.

- [x] **Немає жодного RTL/компонентного тесту** — попри встановлені
      `@testing-library/react`/`jest-dom`/`user-event`, усі 9 тестових файлів — чисті юніти.
      **Дія:** додати хоча б один тест на `TicketsBoard` (рендер зі справжнім store, клік по
      фільтру/сорту/"показати ще", перевірка зміни DOM).

- [x] **Немає публічного API (`model/index.ts`) для feature/entity-модулів** — усюди глибокі
      імпорти в `model/selectors`, `model/*Slice` напряму.
      **Дія (опційно):** додати `model/index.ts` у кожен feature/entity з реекспортом.

---

## Що додатково підніме рівень (не обов'язково)

- [x] Error Boundary навколо `<App />`/`<HomePage />`.
- [x] Skeleton-лоадер карток замість тексту "Завантаження…" (`TicketsBoard.tsx:29`).
- [x] Виправити a11y-чекбокс нативним `<input type="checkbox">` (об'єднати з критичним
      пунктом вище). — закрито через `tabIndex`+`onKeyDown` варіант (див. критичний пункт).
- [x] Хоч один RTL-тест на `TicketsBoard` (об'єднати з пунктом вище).
- [x] Синхронізація фільтра/сортування з URL query-параметрами (`?stops=1,2&sort=cheapest`).

---

## ✅ Гаразд (без дій, для довідки)

- Фільтр 0/1/2/3/"Всі" — логіка коректна.
- Компаратор "Оптимальне": час → пересадки → ціна (`comparators.ts:12-20`).
- Три сортування дають різний результат на реальних 30 квитках.
- Пагінація +5 коректна, кнопка ховається коли показано все.
- BEM дотриманий у всіх 9 `.scss`-файлах.
- Жодного CSS-фреймворку.
- `npm run lint:styles` проходить чисто, жодне правило не вимкнене.
- `tickets.json` типізований і використаний коректно.
- Репозиторій публічний.
- Жодного `any` у `src/`.
- Redux-стан/payload-и типізовані.
- Немає мутацій стору поза Immer (`.slice()` перед `.sort()`).
- Основні похідні селектори мемоізовані через `createSelector`.
- Немає циклічних залежностей між слайсами.
- Компоненти в `ui/` тупі, без бізнес-логіки.
- Обробка fetch 404/500 — читабельне повідомлення, не білий екран.
- Empty-стан при порожній фільтрації реалізований.
- Порожній `tickets: []` коректно падає в empty-стан.
- Розбіжність `segments[0].stops.length !== segments[1].stops.length` — `console.warn`,
  задокументовано.
- Тести змістовні, не "заради галочки".
- Єдиний `console.*` — навмисний.
- Немає `<img>` без `alt` (растрових зображень немає).
- Фокус ніде не приглушений (`outline: none` відсутній).
- `SortTabs`/`Button` — семантичні `<button>`.
- `vite.config.ts` `base` збігається з назвою репозиторію.
- CI запускає `lint:styles` і `test` перед `build`.
- README дає робочий шлях запуску з нуля, документує 2 відхилення від FSD.
- Немає мертвого коду; `.gitkeep`-заглушки — навмисні.
