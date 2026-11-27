// HomeLedger state — one store for the whole site. The seed household loads
// first; every change the household makes is saved to localStorage and read
// back on the next visit, so the Dashboard, Budget, Expenses and Goals pages
// always agree with each other.
import {
  CATEGORIES,
  INCOME_SOURCES,
  MONTHLY_SPENDING,
  SEED_GOALS,
  SEED_TRANSACTIONS,
} from "./data.js";

const STORAGE_KEY = "homeledger-v1";

function seedState() {
  return {
    incomeSources: INCOME_SOURCES.map((source) => ({ ...source })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    goals: SEED_GOALS.map((g) => ({ ...g })),
    monthlySpending: MONTHLY_SPENDING.map((m) => ({ ...m })),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const saved = JSON.parse(raw);
    const seed = seedState();
    // Merge over the seed so an older saved state never loses a new field.
    return {
      incomeSources: Array.isArray(saved.incomeSources) ? saved.incomeSources : seed.incomeSources,
      budgets: { ...seed.budgets, ...(saved.budgets || {}) },
      transactions: Array.isArray(saved.transactions) ? saved.transactions : seed.transactions,
      goals: Array.isArray(saved.goals) ? saved.goals : seed.goals,
      monthlySpending: Array.isArray(saved.monthlySpending) ? saved.monthlySpending : seed.monthlySpending,
    };
  } catch {
    return seedState();
  }
}

export const store = {
  state: loadState(),

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Private mode or a full store: the site keeps working in memory.
    }
  },

  reset() {
    this.state = seedState();
    this.save();
  },

  totalIncome() {
    return this.state.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  },

  totalBudgeted() {
    return Object.values(this.state.budgets).reduce((sum, b) => sum + b, 0);
  },

  spentByCategory() {
    const spent = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
    for (const t of this.state.transactions) {
      if (spent[t.category] !== undefined) spent[t.category] += t.amount;
    }
    return spent;
  },

  totalSpent() {
    return this.state.transactions.reduce((sum, t) => sum + t.amount, 0);
  },

  addTransaction({ date, name, category, amount }) {
    const tx = {
      id: `t${Date.now()}`,
      date,
      name: name.trim(),
      category,
      amount: Math.round(amount * 100) / 100,
    };
    this.state.transactions.unshift(tx);
    this.save();
    return tx;
  },

  deleteTransaction(id) {
    this.state.transactions = this.state.transactions.filter((t) => t.id !== id);
    this.save();
  },

  setBudget(categoryId, amount) {
    this.state.budgets[categoryId] = Math.max(0, Math.round(amount * 100) / 100);
    this.save();
  },

  setIncome(index, amount) {
    this.state.incomeSources[index].amount = Math.max(0, Math.round(amount * 100) / 100);
    this.save();
  },

  addGoal({ name, target, saved, note }) {
    const goal = {
      id: `g${Date.now()}`,
      name: name.trim(),
      target: Math.round(target * 100) / 100,
      saved: Math.round(saved * 100) / 100,
      note: (note || "").trim(),
    };
    this.state.goals.push(goal);
    this.save();
    return goal;
  },

  contributeToGoal(id, amount) {
    const goal = this.state.goals.find((g) => g.id === id);
    if (!goal) return;
    goal.saved = Math.round((goal.saved + amount) * 100) / 100;
    this.save();
  },

  deleteGoal(id) {
    this.state.goals = this.state.goals.filter((g) => g.id !== id);
    this.save();
  },
};
