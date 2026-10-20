# Finora — Personal Finance Tracker

A local-first personal finance tracker built with React and Vite. Finora starts with empty records and displays values only after you add transactions, budgets, or savings goals. Data stays in the current browser; Finora does not connect to banks or send records to a server.

## Features

- Overview dashboard with transaction-based income, expenses, net savings, lifetime net balance, charts, budgets, goals, and recent transactions.
- Transaction create, edit, delete, search, type/category/month filters, sorting, and filtered CSV export.
- Offline rule-based category suggestions.
- Monthly category budgets and tracked savings goals.
- Currency display preferences (INR, USD, EUR, GBP), light/dark theme, JSON backup export and import, and data reset.
- Responsive desktop and mobile layouts.

## Stack

React 19, Vite 8, Recharts, Lucide React, and browser LocalStorage.

## Setup

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

## Commands

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Data and privacy

Records use versioned browser keys: `finora.transactions.v1`, `finora.budgets.v1`, `finora.savingsGoals.v1`, and `finora.settings.v1`. Currency changes affect display formatting only. Savings goal updates are tracking entries and do not change transaction balances. Clearing browser storage can remove your records. Export a JSON backup from Settings before clearing or changing browsers. Import replaces current records after confirmation.

Finora starts with no sample records. Existing sample records from an earlier version are cleared automatically on the next launch. Add transactions, budgets, and goals to populate the dashboard.

## MVP limitations

- No bank syncing, authentication, server-side storage, cross-device sync, or exchange-rate conversion.
- LocalStorage availability and browser quota can limit persistence.
- Financial figures are derived from manually entered records. Total balance is lifetime income minus expenses; net savings follows the selected reporting period.
