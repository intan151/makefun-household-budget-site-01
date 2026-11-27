// HomeLedger Dashboard view — the month at a glance: income, spending,
// what is left, a donut of where the money went, six months of bars, and the
// newest expenses.
import { CATEGORIES, HOUSEHOLD_NAME, MONTH_LABEL } from "./data.js";
import { fmtMoney, fmtMoneyWhole, fmtShortDate, escapeHtml } from "./format.js";
import { store } from "./store.js";
import { donutChart, barChart } from "./charts.js";

export function renderDashboard(app) {
  const income = store.totalIncome();
  const budgeted = store.totalBudgeted();
  const spent = store.totalSpent();
  const left = income - spent;
  const toAssign = income - budgeted;
  const spentByCategory = store.spentByCategory();
  const recent = [...store.state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  const donutSlices = CATEGORIES.filter((c) => c.id !== "savings").map((c) => ({
    label: c.name,
    value: spentByCategory[c.id],
    color: c.color,
  }));

  app.innerHTML = `
  <div class="page-head">
    <h1>${escapeHtml(HOUSEHOLD_NAME)} — ${MONTH_LABEL}</h1>
    <p class="lede">Your month at a glance. Income, spending and savings for one household, kept in one place — no accounts, no ads, no spreadsheets.</p>
  </div>

  <div class="grid grid-3" style="margin-bottom:16px">
    <div class="card stat-card">
      <span class="stat-label">Income this month</span>
      <span class="stat-value green">${fmtMoney(income)}</span>
      <span class="stat-note">${store.state.incomeSources.length} sources — see the Budget page to edit them</span>
    </div>
    <div class="card stat-card">
      <span class="stat-label">Spent so far</span>
      <span class="stat-value">${fmtMoney(spent)}</span>
      <span class="stat-note">of ${fmtMoney(budgeted)} budgeted across ${CATEGORIES.length} categories</span>
    </div>
    <div class="card stat-card">
      <span class="stat-label">Left to spend</span>
      <span class="stat-value ${left < 0 ? "red" : "green"}">${fmtMoney(left)}</span>
      <span class="stat-note">${toAssign > 0 ? `${fmtMoney(toAssign)} still unassigned — give it a job on the Budget page` : "Every dollar has a job this month"}</span>
    </div>
  </div>

  <div class="grid grid-dash">
    <div class="card">
      <h2>Where the money went</h2>
      <p class="muted small">Spending by category, not counting the ${fmtMoneyWhole(store.state.budgets.savings)} moved to savings.</p>
      ${donutChart(donutSlices, spent - spentByCategory.savings)}
    </div>
    <div class="card">
      <h2>Last six months</h2>
      <p class="muted small">Total spending per month. November is the dark bar — the month in progress.</p>
      ${barChart(store.state.monthlySpending)}
      <p class="stat-note">Average: <strong>${fmtMoney(store.state.monthlySpending.reduce((s, m) => s + m.spent, 0) / store.state.monthlySpending.length)}</strong> a month. September was the dearest month at ${fmtMoney(4510)}.</p>
    </div>
  </div>

  <div class="grid grid-dash" style="margin-top:16px">
    <div class="card">
      <h2>Budget vs. actual</h2>
      <table>
        <thead><tr><th>Category</th><th class="num">Budget</th><th class="num">Spent</th><th class="num">Left</th></tr></thead>
        <tbody>
          ${CATEGORIES.map((c) => {
            const s = spentByCategory[c.id];
            const leftCat = c.budget - s;
            return `<tr><td>${c.name}</td><td class="num">${fmtMoney(store.state.budgets[c.id])}</td><td class="num">${fmtMoney(s)}</td><td class="num" style="color:${leftCat < 0 ? "var(--red)" : "inherit"}">${fmtMoney(leftCat)}</td></tr>`;
          }).join("")}
        </tbody>
      </table>
      <p style="margin-top:12px"><a href="#/budget">Adjust the budget &rarr;</a></p>
    </div>
    <div class="card">
      <h2>Recent expenses</h2>
      <ul class="tx-list">
        ${recent.map((t) => `<li>
          <span class="tx-date">${fmtShortDate(t.date)}</span>
          <span class="tx-name"><b>${escapeHtml(t.name)}</b><span>${categoryById[t.category]?.name || t.category}</span></span>
          <span class="tx-amount">${fmtMoney(t.amount)}</span>
        </li>`).join("")}
      </ul>
      <p style="margin-top:12px"><a href="#/expenses">See all ${store.state.transactions.length} expenses &rarr;</a></p>
    </div>
  </div>`;
}
