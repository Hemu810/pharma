# Veridian — Aurion (frontend prototype)

A React + Vite implementation of the Aurion UI mock-up: Aurion is the flagship
biopharma data intelligence product inside Veridian's wider product suite,
covering **Drugs, Clinical Trials, Companies, Drug Price, Cost of Therapy,**
and **International Reference Pricing**. It ships with a query builder,
per-module search-field catalog, filters, a configurable data table, tiered
export (quick / custom / AI-assisted Excel), an AI analyst side panel, a
cross-module Analytics dashboard, and a Home landing page.

The top navbar's **Products** mega-menu also surfaces Aurion's sibling
platforms (BIO 360, Clinovate, HEOR Via, MolecuLens, NextGen) as
placeholder/waitlist entries, matching how a multi-product suite would present
"what else is in this family" alongside the product you're actually using.

This is a **UI/UX prototype with mock data** — there is no backend. Every screen
is real, interactive React, but table contents, search results, and AI answers are
static/sample so the whole experience runs client-side with `npm run dev`.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  main.jsx                 # React entry point
  App.jsx                  # Top-level state + layout orchestration
  index.css                # All styling (design tokens as CSS variables, no CSS framework)

  data/
    modules.js              # MODULES: per-module label, icon key, result count, default
                             # filters, and view definitions (columns + sample rows)
    nav.js                  # NAV_ORDER: module grouping/order (used by the Products mega-menu + Home)
    platforms.js             # PLATFORMS: Aurion + its sibling product lines shown in the
                             # Products mega-menu and the Home page's "Explore the Aurion suite"
    fields.js                # FIELD_DEFS: the searchable-field catalog shown in the
                             # "Search fields" browser, grouped per module
    icons.jsx               # Inline SVG icon components (no icon-font dependency)

  components/
    TopNav.jsx                # Sticky dark top navbar: Home / Products (mega-menu) /
                             # Industry Trends / Reports, plus Ask Analyst + avatar
    Home.jsx                  # Landing page: "Ask Aurion" hero search, module grid,
                             # sibling-platform grid, saved searches, portfolio KPIs
    SearchBuilder.jsx        # The "molecule chain" query builder (field/op/value nodes
                             # joined by clickable AND/OR bonds)
    SearchFieldsModal.jsx    # Field browser — multi-select fields, then confirm to add
                             # them all to the builder in one batch
    SubTabs.jsx               # Sub-view tab strip (Basic / Regulatory / Forecast, etc.)
    FilterBar.jsx             # Removable filter chips + "Add filter"
    TableToolbar.jsx          # Results count, Columns dropdown, Export dropdown
    DataTable.jsx             # Renders the active view's columns/rows, incl. status badges
    Badge.jsx                 # Status-pill renderer (good / warn / bad / neutral)
    CustomExportModal.jsx     # Column picker + format + row-scope export dialog
    AIExportModal.jsx         # "Export to Excel with AI query" dialog
    AIPanel.jsx               # AI Analyst side drawer (suggested prompts + free text)
    Analytics.jsx             # Cross-module KPI cards + charts view
    Modal.jsx                 # Generic overlay/dialog wrapper used by the export modals
                             # and the field browser
    Toast.jsx                 # Bottom-center transient notification

  hooks/
    useToast.js               # Minimal single-message toast manager

  utils/
    classify.js               # Badge tone classification + numeric-cell detection
```

## Navigation model

`App.jsx` holds a single `page` state: `'home' | 'module' | 'analytics'`.

- **TopNav** is always visible (sticky, `position: sticky; top: 0`) and renders
  Home / Products / Industry Trends / Reports plus Ask Analyst and the avatar.
  The **Products** button opens a two-column mega-menu: column 1 lists every
  platform (`data/platforms.js`), column 2 previews whichever platform is
  selected — for **Aurion** that's the full module list (grouped, with a
  divider before the pricing modules); for the other platforms it's either a
  single stubbed sub-item (Clinovate → Gen AI Protocol, HEOR Via → Smart HTA
  Dossier, NextGen → BioPharmaKSM) or a generic "join the waitlist" panel.
- **Home** (`page === 'home'`) is the landing page.
- **Analytics** (`page === 'analytics'`) is the cross-module dashboard.
- **Module pages** (`page === 'module'`) render the shared module chrome
  (search bar, query builder, sub-view tabs, filters, table toolbar, data
  table, AI panel) driven by `moduleKey` / `viewKey`.

There is no sidebar and no separate status ribbon — navigation lives entirely
in the top bar, and the header background intentionally reuses the same dark
navy (`#0E1726`) that platform data-freshness indicators would typically use,
so it reads as a persistent "system chrome" bar rather than page content.

## Data model

Every module in `data/modules.js` follows the same shape:

```js
drugs: {
  label: 'Drugs',
  icon: 'drug',              // key into ICONS in data/icons.jsx
  count: '6,482',            // display-only "total matching records" figure
  desc: '...',
  filters: ['Molecule Type: Small molecule + mAb', 'Phase: III – Marketed', ...],
  views: {
    basic: {
      label: 'Basic',
      cols: ['Drug Name', 'Molecule Type', ...],
      rows: [
        ['Zomarlimab', 'Monoclonal antibody', ..., { badge: 'Marketed' }],
        ...
      ],
    },
    ...
  },
},
```

**Row cells** are either a plain string/number, or a small descriptor object so
`DataTable` can render a status pill without any HTML in the data:

```js
{ badge: 'Approved' }                    // renders a colored status pill
{ badge: 'High', suffix: ' 1.33×' }      // pill + trailing plain text (used in IRP)
```

**Search fields** in `data/fields.js` are grouped per module and typed so the
builder can pick a sensible default operator/value when a field is added:

```js
'Identity & Classification': [
  { n: 'Drug Name', t: 'txt' },     // txt   -> "contains"
  { n: 'Approval Date', t: 'date' } // date  -> "between"
  { n: 'Indication', t: 'enum' }    // enum  -> "="
  { n: 'Enrollment Size', t: 'num' } // num  -> "between"
],
```

**Platforms** in `data/platforms.js` describe the Products mega-menu entries:

```js
{
  key: 'clinovate',
  label: 'Clinovate',
  sub: 'Clinical innovation & protocol design',
  launching: true,
  hasSubmenu: true,          // shows a chevron in column 1
  submenuItem: 'Gen AI Protocol', // the single stub item shown in column 2
},
```

Only `aurion` is a real, functional platform; the rest are intentionally inert
placeholders (clicking them shows a "join the waitlist" toast).

## Wiring this up to a real backend

Everything that would hit an API is currently a `showToast(...)` call in `App.jsx`.
The natural integration points are:

- **Search / Build search / Run search** — `onRunSearch` in `SearchBuilder` should
  call your search API with the current `conditions` array and replace the active
  view's `rows` with the response.
- **Search fields** — `FIELD_DEFS` should eventually come from your schema/metadata
  service rather than being hand-authored, so new indexed fields show up automatically.
- **Filters** — `FilterBar` currently only removes chips locally; wire `onAddFilter`
  to a real filter-picker and re-run the search when chips change.
- **Quick / Custom / AI export** — `onQuickExport`, `onCustomExport` (via
  `CustomExportModal`'s `onExport`), and `onAIExport` (via `AIExportModal`'s
  `onExport`) currently just toast. Point these at an export/report-generation
  endpoint; `AIExportModal` already collects the natural-language query, format,
  row scope, and sheet name needed to build that request.
- **AI Analyst / Ask Analyst / Ask Aurion** — `AIPanel`'s `runQuery` currently sets
  a canned answer, and the "Ask Analyst" navbar button and the Home hero search
  both currently just open that panel or toast. Replace with a call to your
  LLM/analytics service, passing the question plus the active module/view/rows
  as context.
- **Other platforms** — each non-Aurion entry in `data/platforms.js` currently
  resolves to a toast. Once those products exist, point them at real URLs/routes
  instead.
- **Pagination** — `DataTable`'s footer controls are currently decorative; wire
  them to real paging once rows are server-driven.

## Notes on scope

- Sample data covers 6 fictional drugs, 6 fictional companies, and matching
  trials/sites/pricing rows so every module tells one consistent story — swap in
  real data by following the same shape.
- Cost of Therapy and International Reference Pricing field lists in
  `data/fields.js` were extended to match the pattern of the other modules since
  they weren't explicitly specified; adjust freely.
- No CSS framework is used — all design tokens are CSS custom properties at the
  top of `index.css`, so retheming is a matter of editing that `:root` block.
