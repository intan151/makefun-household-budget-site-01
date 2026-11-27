// HomeLedger Expenses and Goals views — the day-to-day tracker and the
// longer-term targets. Both write through the store, so the Dashboard and
// Budget pages update with them.
import { CATEGORIES } from "./data.js";
import { fmtMoney, fmtShortDate, clamp, escapeHtml } from "./format.js";
import { store } from "./store.js";

export function renderExpenses(app) {
  const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const spentByCategory = store.spentByCategory();
  const sorted = [...store.state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));

  app.innerHTML = `
  <div class="page-head">
    <h1>Expenses</h1>
    <p class="lede">Every dollar out, in one list. Add an expense as it happens — the category totals and the Dashboard update with it.</p>
  </div>

  <div class="grid grid-dash">
    <div class="card">
      <h2>Add an expense</h2>
      <form id="expense-form">
        <div class="form-row">
          <div class="field">
            <label for="exp-date">Date</label>
            <input id="exp-date" type="date" value="2026-11-27" required>
          </div>
          <div class="field">
            <label for="exp-amount">Amount ($)</label>
            <input id="exp-amount" type="number" min="0.01" step="0.01" placeholder="24.50" required>
          </div>
        </div>
        <div class="field">
          <label for="exp-name">What was it?</label>
          <input id="exp-name" type="text" maxlength="80" placeholder="e.g. Weekly groceries — Aldi" required>
        </div>
        <div class="field">
          <label for="exp-category">Category</label>
          <select id="exp-category">
            ${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
          </select>
        </div>
        <div class="btn-row">
          <button class="btn" type="submit">Add expense</button>
          <span id="exp-confirm" class="small" style="color:var(--green);font-weight:700"></span>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Spending by category</h2>
      <table>
        <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th>Used</th></tr></thead>
        <tbody>
          ${CATEGORIES.map((c) => {
            const spent = spentByCategory[c.id];
            const budget = store.state.budgets[c.id];
            const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
            return `<tr><td>${c.name}</td><td class="num">${fmtMoney(spent)}</td><td class="num">${fmtMoney(budget)}</td>
              <td class="bar-cell"><div class="mini-bar ${spent > budget ? "over" : ""}"><span style="width:${clamp(pct, 0, 100)}%"></span></div><span class="small">${pct}%</span></td></tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h2>All expenses — ${sorted.length} this month</h2>
    <div class="form-row" style="max-width:420px">
      <div class="field">
        <label for="exp-filter">Show only</label>
        <select id="exp-filter">
          <option value="">All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
        </select>
      </div>
    </div>
    <ul class="tx-list" id="tx-list">
      ${sorted.map((t) => `<li data-category="${t.category}">
        <span class="tx-date">${fmtShortDate(t.date)}</span>
        <span class="tx-name"><b>${escapeHtml(t.name)}</b><span>${categoryById[t.category]?.name || t.category}</span></span>
        <span class="tx-amount">${fmtMoney(t.amount)}</span>
        <button class="btn small danger" type="button" data-delete-tx="${t.id}">Delete</button>
      </li>`).join("")}
    </ul>
  </div>`;

  app.querySelector("#expense-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const date = app.querySelector("#exp-date").value;
    const amount = Number(app.querySelector("#exp-amount").value);
    const name = app.querySelector("#exp-name").value;
    const category = app.querySelector("#exp-category").value;
    if (!date || !name.trim() || !(amount > 0)) return;
    store.addTransaction({ date, name, category, amount });
    renderExpenses(app);
    const confirm = app.querySelector("#exp-confirm");
    if (confirm) confirm.textContent = "Added — totals updated.";
  });
  app.querySelector("#exp-filter").addEventListener("change", (event) => {
    const wanted = event.target.value;
    app.querySelectorAll("#tx-list li").forEach((li) => {
      li.style.display = !wanted || li.dataset.category === wanted ? "" : "none";
    });
  });
  app.querySelectorAll("[data-delete-tx]").forEach((button) => {
    button.addEventListener("click", () => {
      store.deleteTransaction(button.dataset.deleteTx);
      renderExpenses(app);
    });
  });
}

export function renderGoals(app) {
  const totalSaved = store.state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = store.state.goals.reduce((s, g) => s + g.target, 0);

  app.innerHTML = `
  <div class="page-head">
    <h1>Savings goals</h1>
    <p class="lede">The future, in four targets. Contribute to a goal whenever money is free — the progress bars and the total below move with it.</p>
  </div>

  <div class="callout">
    <p><strong>${fmtMoney(totalSaved)}</strong> saved toward <strong>${fmtMoney(totalTarget)}</strong> across ${store.state.goals.length} goals — <strong>${Math.round((totalSaved / totalTarget) * 100)}%</strong> of the way there.</p>
  </div>

  <div class="grid grid-2">
    ${store.state.goals.map((goal) => {
      const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
      return `<div class="card">
        <div class="goal-head"><b>${escapeHtml(goal.name)}</b><span class="pill">${clamp(pct, 0, 100)}%</span></div>
        <p class="small muted">${escapeHtml(goal.note || "")}</p>
        <div class="progress ${pct >= 100 ? "" : "amber"}"><span style="width:${clamp(pct, 0, 100)}%"></span></div>
        <p><strong>${fmtMoney(goal.saved)}</strong> of ${fmtMoney(goal.target)} — ${fmtMoney(Math.max(0, goal.target - goal.saved))} to go</p>
        <div class="form-row">
          <div class="field">
            <label for="add-${goal.id}">Add to this goal ($)</label>
            <input id="add-${goal.id}" type="number" min="1" step="10" placeholder="50">
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <button class="btn small" type="button" data-contribute="${goal.id}">Contribute</button>
          </div>
        </div>
        <button class="btn small danger" type="button" data-delete-goal="${goal.id}">Remove goal</button>
      </div>`;
    }).join("")}
  </div>

  <div class="card" style="margin-top:16px">
    <h2>Start a new goal</h2>
    <form id="goal-form">
      <div class="form-row-3">
        <div class="field">
          <label for="goal-name">Goal name</label>
          <input id="goal-name" type="text" maxlength="60" placeholder="e.g. New washing machine" required>
        </div>
        <div class="field">
          <label for="goal-target">Target amount ($)</label>
          <input id="goal-target" type="number" min="1" step="10" placeholder="800" required>
        </div>
        <div class="field">
          <label for="goal-saved">Already saved ($)</label>
          <input id="goal-saved" type="number" min="0" step="10" value="0">
        </div>
      </div>
      <div class="field">
        <label for="goal-note">Note (optional)</label>
        <input id="goal-note" type="text" maxlength="100" placeholder="e.g. Buy before winter">
      </div>
      <button class="btn" type="submit">Add goal</button>
    </form>
  </div>`;

  app.querySelectorAll("[data-contribute]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = app.querySelector(`#add-${button.dataset.contribute}`);
      const amount = Number(input?.value);
      if (!(amount > 0)) {
        input?.focus();
        return;
      }
      store.contributeToGoal(button.dataset.contribute, amount);
      renderGoals(app);
    });
  });
  app.querySelectorAll("[data-delete-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      store.deleteGoal(button.dataset.deleteGoal);
      renderGoals(app);
    });
  });
  app.querySelector("#goal-form").addEventListener("submit", (event) => {
    event.preventDefault();
    store.addGoal({
      name: app.querySelector("#goal-name").value,
      target: Number(app.querySelector("#goal-target").value) || 0,
      saved: Number(app.querySelector("#goal-saved").value) || 0,
      note: app.querySelector("#goal-note").value,
    });
    renderGoals(app);
  });
}
