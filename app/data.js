// HomeLedger seed data — the sample household every page starts from.
// All figures are invented for the demo household; the Budget and Expenses
// pages let the household replace them with its own numbers.
export const HOUSEHOLD_NAME = "The Rivera Household";
export const MONTH_LABEL = "November 2026";

export const INCOME_SOURCES = [
  { name: "Salary — Maya", amount: 3400 },
  { name: "Salary — Daniel", amount: 1450 },
  { name: "Freelance weekends", amount: 350 },
];

export const CATEGORIES = [
  { id: "housing", name: "Housing", color: "#1d5c46", budget: 1750 },
  { id: "groceries", name: "Groceries", color: "#2f6f8f", budget: 620 },
  { id: "transport", name: "Transport", color: "#e8a13a", budget: 380 },
  { id: "utilities", name: "Utilities", color: "#7a6fb0", budget: 240 },
  { id: "dining", name: "Dining out", color: "#b3402e", budget: 220 },
  { id: "entertainment", name: "Entertainment", color: "#4a9b6b", budget: 150 },
  { id: "health", name: "Health", color: "#c97b9a", budget: 200 },
  { id: "kids", name: "Kids & school", color: "#8a6d3b", budget: 310 },
  { id: "personal", name: "Personal", color: "#5f6f66", budget: 180 },
  { id: "savings", name: "Savings", color: "#143f31", budget: 800 },
];

// Six months of total spending, oldest first; the last bar is this month so far.
export const MONTHLY_SPENDING = [
  { month: "Jun", spent: 4120 },
  { month: "Jul", spent: 4380 },
  { month: "Aug", spent: 4290 },
  { month: "Sep", spent: 4510 },
  { month: "Oct", spent: 4180 },
  { month: "Nov", spent: 3581 },
];

export const SEED_TRANSACTIONS = [
  { id: "t01", date: "2026-11-26", name: "Whole Foods Market", category: "groceries", amount: 86.4 },
  { id: "t02", date: "2026-11-25", name: "Monthly rent", category: "housing", amount: 1750 },
  { id: "t03", date: "2026-11-24", name: "Gas — Shell", category: "transport", amount: 42.5 },
  { id: "t04", date: "2026-11-23", name: "Electric bill", category: "utilities", amount: 118.6 },
  { id: "t05", date: "2026-11-22", name: "Pizza night — family", category: "dining", amount: 38.75 },
  { id: "t06", date: "2026-11-21", name: "School supplies", category: "kids", amount: 64.2 },
  { id: "t07", date: "2026-11-20", name: "Pharmacy", category: "health", amount: 27.99 },
  { id: "t08", date: "2026-11-19", name: "Weekly groceries — Aldi", category: "groceries", amount: 112.3 },
  { id: "t09", date: "2026-11-18", name: "Movie night streaming", category: "entertainment", amount: 15.99 },
  { id: "t10", date: "2026-11-17", name: "Bus passes — kids", category: "transport", amount: 48 },
  { id: "t11", date: "2026-11-15", name: "Haircut — Daniel", category: "personal", amount: 28 },
  { id: "t12", date: "2026-11-14", name: "Weekly groceries — Aldi", category: "groceries", amount: 98.15 },
  { id: "t13", date: "2026-11-12", name: "Internet bill", category: "utilities", amount: 80 },
  { id: "t14", date: "2026-11-10", name: "Dentist co-pay", category: "health", amount: 60 },
  { id: "t15", date: "2026-11-08", name: "Kids' shoes", category: "kids", amount: 74.5 },
  { id: "t16", date: "2026-11-05", name: "Weekly groceries — Aldi", category: "groceries", amount: 121.4 },
  { id: "t17", date: "2026-11-03", name: "Transfer to emergency fund", category: "savings", amount: 800 },
  { id: "t18", date: "2026-11-01", name: "Lunch out — work", category: "dining", amount: 14.5 },
];

export const SEED_GOALS = [
  { id: "g1", name: "Emergency fund", target: 6000, saved: 4150, note: "3 months of essential bills" },
  { id: "g2", name: "Family vacation — beach trip", target: 2400, saved: 1050, note: "Flights + stay for four, next July" },
  { id: "g3", name: "New car down payment", target: 5000, saved: 1800, note: "Replace the 2012 sedan" },
  { id: "g4", name: "Holiday gifts", target: 600, saved: 320, note: "Gifts for family, due December" },
];

// The 50/30/20 rule, as plain numbers the calculator and guide both reuse.
export const RULE_50_30_20 = { needs: 50, wants: 30, savings: 20 };
