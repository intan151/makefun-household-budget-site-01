// HomeLedger Guide view — the written content of the site: the 50/30/20
// rule, a weekly routine, and the habits that keep a household budget alive.
import { fmtMoney } from "./format.js";

export function renderGuide(app) {
  app.innerHTML = `
  <div class="page-head">
    <h1>Budgeting guide</h1>
    <p class="lede">A household budget is not a diet — it is a plan for the money you already earn. These are the ideas this site is built on.</p>
  </div>

  <div class="grid grid-2">
    <div class="card">
      <h2>The 50/30/20 rule</h2>
      <p>Split your take-home pay three ways:</p>
      <div class="rule-figure">
        <div class="rule-chip needs"><span class="stat-label">Needs · 50%</span><b>50%</b><span class="small muted">rent, groceries, utilities, transport, insurance</span></div>
        <div class="rule-chip wants"><span class="stat-label">Wants · 30%</span><b>30%</b><span class="small muted">eating out, streaming, hobbies, holidays</span></div>
        <div class="rule-chip saves"><span class="stat-label">Savings · 20%</span><b>20%</b><span class="small muted">emergency fund, goals, extra debt payments</span></div>
      </div>
      <p>For this household's ${fmtMoney(5200)} take-home pay that means about ${fmtMoney(2600)} for needs, ${fmtMoney(1560)} for wants and ${fmtMoney(1040)} for savings. If rent pushes needs over 50%, shrink wants first — never savings.</p>
      <p><a href="#/calculator">Try the numbers in the calculator &rarr;</a></p>
    </div>

    <div class="card">
      <h2>Pay yourself first</h2>
      <p>Move the savings line out of your account on payday, before the month's spending starts — the same day the salary lands. A budget that saves "whatever is left" saves nothing most months, because something always comes up.</p>
      <p>Start small if you must: even ${fmtMoney(50)} a month builds the habit, and the habit is what survives a tight month. Raise it by ${fmtMoney(25)} every time income rises.</p>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h2>The 20-minute weekly check-in</h2>
    <p>Budgets fail quietly. A short weekly routine keeps this one alive:</p>
    <ol class="tips">
      <li><strong>Log the week's spending</strong> — five minutes on the <a href="#/expenses">Expenses page</a>. Receipts in a drawer work; memory does not.</li>
      <li><strong>Check one category</strong> — is groceries on track? If a category is over, move money from a category that is under, instead of pretending it did not happen.</li>
      <li><strong>Move money to a goal</strong> — even a small contribution on the <a href="#/goals">Goals page</a> keeps the target visible.</li>
      <li><strong>Look ahead one week</strong> — birthdays, car service, school trips. A budget that sees the next bill coming never gets surprised by it.</li>
    </ol>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <div class="card">
      <h2>Five habits that save real money</h2>
      <ol class="tips">
        <li><strong>Plan meals before shopping.</strong> A list cuts the average grocery bill by a tenth — for this household, about ${fmtMoney(62)} a month.</li>
        <li><strong>Wait 48 hours on wants over ${fmtMoney(50)}.</strong> Most of them stop feeling urgent by day two.</li>
        <li><strong>Audit subscriptions every season.</strong> One forgotten streaming service is ${fmtMoney(192)} a year.</li>
        <li><strong>Cook twice, eat four times.</strong> Leftovers are the cheapest lunch a household owns.</li>
        <li><strong>Keep one "fun money" line.</strong> A budget with no room for joy gets abandoned; a small, honest fun line keeps the rest of it standing.</li>
      </ol>
    </div>
    <div class="card">
      <h2>When the month goes wrong</h2>
      <p>An over-budget month is information, not failure. Ask three questions:</p>
      <ol class="tips">
        <li>Was it a one-off (a car repair, a medical bill) or a pattern (dining out every week)?</li>
        <li>Which category lent the money — and was that category really under, or just quiet?</li>
        <li>What changes next month: a bigger line for the real cost, or a smaller habit?</li>
      </ol>
      <p>Then adjust the numbers on the <a href="#/budget">Budget page</a> and carry on. The best household budget is the one still in use in December.</p>
    </div>
  </div>`;
}
