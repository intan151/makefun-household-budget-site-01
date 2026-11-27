# HomeLedger — Household Budget Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![make.fun entry](https://img.shields.io/badge/make.fun-best%20household%20budget%20site-blue)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Static site](https://img.shields.io/badge/site-static%20HTML%2FCSS%2FJS-orange)](app/index.html)

HomeLedger is a household budget planner that runs entirely in your browser — no accounts, no tracking, no network requests. Plan the month, track every expense, grow savings goals and learn the 50/30/20 rule, all from one small static site.

## What it does

- **Dashboard** — income, spending and what's left for the Rivera household in November 2026, a donut of spending by category, six months of bars, budget vs. actual, and recent expenses.
- **Budget** — edit take-home pay and every category budget with numbers or sliders; totals update at once and save in your browser.
- **Expenses** — add expenses as they happen, filter by category, delete mistakes; category totals update everywhere.
- **Goals** — savings targets with progress bars; contribute any amount, add your own goals.
- **Calculator** — the 50/30/20 split for any take-home pay, plus a "save by a date" planner.
- **Guide** — the 50/30/20 rule, pay-yourself-first, a 20-minute weekly check-in, and habits that save real money.

All figures are a sample household's, included so every page works out of the box — replace them on the Budget page or add your own expenses and the whole site updates.

## Run it

```sh
# serve the static site (any static server works)
python3 -m http.server 8137 --directory app
# open http://localhost:8137/
```

## Hand it in (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `vendor/makefun-frontend.ts` library. Node 22 or later, standard library only, no build step.

## Layout

```
app/
  index.html          shell: header, nav, footer, app mount
  style.css           the whole look, incl. the phone layout
  main.js             hash router
  data.js             sample household: income, categories, transactions, goals
  store.js            state + localStorage persistence
  format.js           money and date formatting
  charts.js           hand-rolled SVG donut + bar charts
  views-dashboard.js  the month at a glance
  views-budget.js     budget planner + calculator
  views-tracker.js    expenses + savings goals
  views-guide.js      budgeting guide
screenshots/         3 desktop + 1 phone render of the site
```

## About this entry

Built for the [make.fun "Make the best household budget site" bounty](https://make.fun/c/best-household-budget-site-20261126-1457). Original design, text and figures; no external requests, fonts or images — everything the site shows is a file under `app/`.
