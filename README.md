# Risk Analytics Dashboard

A credit risk monitoring dashboard concept for financial analysts tracking corporate rating changes across a 40-company global portfolio. Built from scratch as a portfolio project to demonstrate professional-grade frontend engineering — not affiliated with or endorsed by any rating agency.

**[Live Demo](https://moodys-dashboard.vercel.app)** · Demo login: any email + a 6+ character password

## Features

- **Dashboard** — KPI cards, rating trend line chart and status donut chart, a fully filterable/sortable/paginated ratings table, CSV export, and print-to-PDF
- **Chart ↔ table drill-down** — click a chart legend or a data point to filter the table to that status or month; click a KPI card to jump straight to its underlying filter
- **Company detail slide-over** — 6-month rating sparkline, analyst notes, and key facts for any row
- **Alerts** — downgrade-only view with an automatic severity score (High/Medium/Low) based on notch drop
- **Portfolio** — industry and credit-tier aggregation with stacked bar charts and a sortable breakdown table
- **Dark mode** — persisted theme, including a dedicated chart color system since Recharts renders outside the Tailwind cascade
- **Skeleton loading states** on every view, sized to match the real layout so nothing reflows when data arrives
- **Session-based auth** via a protected route wrapper (no backend — this is a frontend showcase)

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v7 |
| Class merging | clsx + tailwind-merge |
| State | React Context + custom hooks (no Redux at this scale) |

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL and log in with any email and a password of 6+ characters (all data is mocked client-side — there is no backend).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # eslint
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Design system primitives (Button, Badge, Input, Card, Skeleton, ...)
│   └── dashboard/    # Feature components (Navbar, Sidebar, KpiCard, charts, ...)
├── context/          # ThemeContext, ToastContext
├── data/             # Mock 40-company dataset
├── hooks/            # useDashboardFilters, useTheme, useToast
├── lib/              # cn(), CSV export, chart color tokens
├── pages/            # Login, Dashboard, Alerts, Portfolio
├── App.jsx           # Router + protected routes
├── main.jsx          # Provider tree
└── index.css         # Design tokens, animations, print styles
```

## Notable Engineering Decisions

- **Shared filter state lives in a hook, not a component.** `useDashboardFilters` is the single source of truth for search, filters, pagination, and the chart drill-down selection, so the KPI cards, both charts, and the table can all read/write the same state without prop-drilling through a common parent.
- **Chart theming is centralized.** Recharts renders to SVG and can't consume Tailwind's `dark:` classes, so all data-ink colors (line/bar/donut) are sourced from one `chartColors.js` palette keyed by a `theme` boolean — adding a chart or changing a color touches one file.
- **Percentage-based chart radii.** The status donut uses `innerRadius="38%"`/`outerRadius="58%"` instead of fixed pixels, so it scales with its container instead of overflowing on narrow screens.
- **Skeletons mirror real layout dimensions** (same column widths, same text sizes) to avoid layout shift when content loads.

## License

MIT — this is a portfolio/demo project using entirely synthetic data.
