// HomeLedger Budget page and Calculator page — the planner and the maths
// behind it. The Budget page edits income and every category; the Calculator
// page answers "what should our split be?" with the 50/30/20 rule and a
// savings-date planner.
import { CATEGORIES, RULE_50_30_20 } from "./data.js";
import { fmtMoney, clamp, escapeHtml } from "./format.js";
import { store } from "./store.js";

function categoryRow(category) {
  const budget = store.state.budgets[category.id];
  const spent = store.spentByCategory()[category.id];
  const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const over = spent > budget;
  return `<div class="card" style="margin-bottom:12px">
    <div class="goal-head">
      <b>${category.name}</b>
      <span class="pill ${over ? "warn" : ""}">${over ? "Over budget" : `${pct}% used`}</span>
    </div>
    <div class="progress ${over ? "over" : ""}"><span style="width:${clamp(pct, 0, 100)}%"></span></div>
    <p class="small muted">${fmtMoney(spent)} spent of ${fmtMoney(budget)} budgeted — ${fmtMoney(budget - spent)} left</p>
    <div class="form-row">
      <div class="field">
        <label for="budget-${category.id}">Monthly budget</label>
        <input id="budget-${category.id}" type="number" min="0" step="10" value="${budget}" data-budget-for="${category.id}">
      </div>
      <div class="field">
        <label for="slider-${category.id}">Adjust</label>
        <input id="slider-${category.id}" type="range" min="0" max="${Math.max(2000, budget * 2)}" step="10" value="${budget}" data-slider-for="${category.id}" aria-label="Adjust ${category.name} budget">
      </div>
    </div>
  </div>`;
}

export function renderBudget(app) {
  const income = store.totalIncome();
  const budgeted = store.totalBudgeted();
  const toAssign = income - budgeted;

  app.innerHTML = `
  <div class="page-head">
    <h1>Monthly budget</h1>
    <p class="lede">Give every dollar a job before the month begins. Change a number or drag a slider — the totals below update at once and are saved in your browser.</p>
  </div>

  <div class="callout ${toAssign < 0 ? "amber" : ""}">
    <p><strong>${fmtMoney(income)}</strong> income &minus; <strong>${fmtMoney(budgeted)}</strong> budgeted =
    <strong>${toAssign >= 0 ? `${fmtMoney(toAssign)} left to assign` : `${fmtMoney(-toAssign)} over income — trim a category below`}</strong>.</p>
  </div>

  <div class="card" style="margin-bottom:16px">
    <h2>Income</h2>
    ${store.state.incomeSources.map((source, i) => `
      <div class="field">
        <label for="income-${i}">${escapeHtml(source.name)}</label>
        <input id="income-${i}" type="number" min="0" step="10" value="${source.amount}" data-income-index="${i}">
      </div>`).join("")}
    <p class="small muted">Total take-home pay: <strong>${fmtMoney(income)}</strong></p>
  </div>

  <h2>Categories</h2>
  ${CATEGORIES.map(categoryRow).join("")}

  <div class="btn-row" style="margin-top:8px">
    <button class="btn secondary" id="reset-budget" type="button">Reset to the sample budget</button>
    <span class="small muted">Reset restores the sample household's figures.</span>
  </div>`;

  app.querySelectorAll("[data-budget-for]").forEach((input) => {
    input.addEventListener("change", () => {
      const value = Number(input.value) || 0;
      store.setBudget(input.dataset.budgetFor, value);
      renderBudget(app);
    });
  });
  app.querySelectorAll("[data-slider-for]").forEach((slider) => {
    slider.addEventListener("input", () => {
      const value = Number(slider.value) || 0;
      store.setBudget(slider.dataset.sliderFor, value);
      const number = app.querySelector(`[data-budget-for="${slider.dataset.sliderFor}"]`);
      if (number) number.value = String(value);
      const callout = app.querySelector(".callout p");
      if (callout) {
        const remaining = store.totalIncome() - store.totalBudgeted();
        callout.innerHTML = `<strong>${fmtMoney(store.totalIncome())}</strong> income &minus; <strong>${fmtMoney(store.totalBudgeted())}</strong> budgeted = <strong>${remaining >= 0 ? `${fmtMoney(remaining)} left to assign` : `${fmtMoney(-remaining)} over income — trim a category below`}</strong>.`;
      }
    });
    slider.addEventListener("change", () => renderBudget(app));
  });
  app.querySelectorAll("[data-income-index]").forEach((input) => {
    input.addEventListener("change", () => {
      store.setIncome(Number(input.dataset.incomeIndex), Number(input.value) || 0);
      renderBudget(app);
    });
  });
  app.querySelector("#reset-budget").addEventListener("click", () => {
    store.reset();
    renderBudget(app);
  });
}

// --- Calculator ---

export function splitByRule(income, needsPct, wantsPct, savingsPct) {
  return {
    needs: (income * needsPct) / 100,
    wants: (income * wantsPct) / 100,
    savings: (income * savingsPct) / 100,
  };
}

export function renderCalculator(app) {
  const income = store.totalIncome();
  const split = splitByRule(income, RULE_50_30_20.needs, RULE_50_30_20.wants, RULE_50_30_20.savings);

  app.innerHTML = `
  <div class="page-head">
    <h1>Budget calculator</h1>
    <p class="lede">Two quick answers: what should our money split look like, and how much must we set aside each month to hit a savings date?</p>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>The 50/30/20 split</h2>
      <p>For a household taking home <strong>${fmtMoney(income)}</strong> a month, the classic rule suggests:</p>
      <div class="rule-figure">
        <div class="rule-chip needs"><span class="stat-label">Needs · 50%</span><b>${fmtMoney(split.needs)}</b><span class="small muted">rent, groceries, bills, transport</span></div>
        <div class="rule-chip wants"><span class="stat-label">Wants · 30%</span><b>${fmtMoney(split.wants)}</b><span class="small muted">eating out, streaming, trips</span></div>
        <div class="rule-chip saves"><span class="stat-label">Savings · 20%</span><b>${fmtMoney(split.savings)}</b><span class="small muted">emergency fund, goals, extra debt payments</span></div>
      </div>
      <div class="field">
        <label for="calc-income">Try your own take-home pay</label>
        <input id="calc-income" type="number" min="0" step="50" value="${income}">
      </div>
      <p class="small muted">This household's real split today: needs ${fmtMoney(2990)} (62%), wants ${fmtMoney(550)} (11%), savings ${fmtMoney(800)} (16%) — housing is heavy, so savings run below 20% for now. The Guide page explains how to close the gap.</p>
    </div>

    <div class="card">
      <h2>Save by a date</h2>
      <p>Pick a target amount and how many months away it is — the calculator tells you the monthly set-aside.</p>
      <div class="form-row">
        <div class="field">
          <label for="save-target">Target amount</label>
          <input id="save-target" type="number" min="0" step="50" value="2400">
        </div>
        <div class="field">
          <label for="save-months">Months from now</label>
          <input id="save-months" type="number" min="1" step="1" value="8">
        </div>
      </div>
      <div class="field">
        <label for="save-have">Already saved</label>
        <input id="save-have" type="number" min="0" step="50" value="1050">
      </div>
      <p id="save-result" class="callout" style="margin-bottom:0"></p>
      <p class="small muted" style="margin-top:10px">Example: the family vacation goal needs ${fmtMoney(2400)} in 8 months with ${fmtMoney(1050)} already saved.</p>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h2>How the numbers work</h2>
    <p>The 50/30/20 rule splits take-home pay into needs (the bills you must pay), wants (the life you enjoy) and savings (the future you). It is a starting point, not a law: a household with high rent may run 60/25/15 for a while, then move savings up as income grows. What matters is that the three add up to 100% and that savings is a fixed line in the budget, not whatever is left over.</p>
    <p><a href="#/guide">Read the full budgeting guide &rarr;</a></p>
  </div>`;

  const incomeInput = app.querySelector("#calc-income");
  incomeInput.addEventListener("input", () => {
    const value = Number(incomeInput.value) || 0;
    const next = splitByRule(value, RULE_50_30_20.needs, RULE_50_30_20.wants, RULE_50_30_20.savings);
    const chips = app.querySelectorAll(".rule-chip b");
    if (chips.length === 3) {
      chips[0].textContent = fmtMoney(next.needs);
      chips[1].textContent = fmtMoney(next.wants);
      chips[2].textContent = fmtMoney(next.savings);
    }
    const intro = app.querySelector(".card p");
    if (intro) intro.innerHTML = `For a household taking home <strong>${fmtMoney(value)}</strong> a month, the classic rule suggests:`;
  });

  function updateSaveResult() {
    const target = Number(app.querySelector("#save-target").value) || 0;
    const months = Math.max(1, Number(app.querySelector("#save-months").value) || 1);
    const have = Number(app.querySelector("#save-have").value) || 0;
    const remaining = Math.max(0, target - have);
    const monthly = remaining / months;
    const result = app.querySelector("#save-result");
    if (remaining === 0) {
      result.innerHTML = `<strong>Target reached!</strong> You already have ${fmtMoney(have)} saved toward ${fmtMoney(target)}.`;
    } else {
      result.innerHTML = `Set aside <strong>${fmtMoney(monthly)} a month</strong> for ${months} months to reach ${fmtMoney(target)} — ${fmtMoney(remaining)} still to save.`;
    }
  }
  ["#save-target", "#save-months", "#save-have"].forEach((selector) => {
    app.querySelector(selector).addEventListener("input", updateSaveResult);
  });
  updateSaveResult();
}
