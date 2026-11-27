// HomeLedger entry point — a tiny hash router. Each section of the site is
// a route (#/, #/budget, #/expenses, #/goals, #/calculator, #/guide) and the
// navigation links in index.html point at them, so every page is one click
// away and the browser's back button works.
import { renderDashboard } from "./views-dashboard.js";
import { renderBudget, renderCalculator } from "./views-budget.js";
import { renderExpenses, renderGoals } from "./views-tracker.js";
import { renderGuide } from "./views-guide.js";

const ROUTES = {
  "": renderDashboard,
  budget: renderBudget,
  expenses: renderExpenses,
  goals: renderGoals,
  calculator: renderCalculator,
  guide: renderGuide,
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES[hash] ? hash : "";
}

function render() {
  const route = currentRoute();
  const app = document.getElementById("app");
  ROUTES[route](app);
  document.querySelectorAll(".mainnav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });
  window.scrollTo(0, 0);
  document.title =
    route === ""
      ? "HomeLedger — Household Budget Planner"
      : `HomeLedger — ${route[0].toUpperCase()}${route.slice(1)} | Household Budget Planner`;
}

window.addEventListener("hashchange", render);
render();
