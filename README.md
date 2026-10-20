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

## Install as an Android app

The production build includes a web app manifest, standard and maskable icons, and a service worker managed by `vite-plugin-pwa` and Workbox. The service worker precaches the built app shell and static assets only; it does not cache API responses or financial records. The app stores records in this browser's LocalStorage, so those records remain available offline on the same device after the app has loaded once. There is no offline synchronization between devices.

### Test locally

```sh
npm run build
npm run preview
```

Open the local preview URL (usually `http://localhost:4173`) in Chrome. In DevTools, check **Application → Manifest** and **Application → Service Workers**. After the first successful load, switch DevTools Network to **Offline** and reload; the cached app should open and show an offline notice.

### Deploy to Vercel

Import the GitHub repository in Vercel and use these project settings:

- Framework preset: **Vite**
- Root directory: repository root (`./`)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none required

The included `vercel.json` rewrites app paths to `index.html` so direct navigation and refresh keep working. Vercel serves deployments over HTTPS, which is required for service workers and PWA installation outside localhost. If you change the project root or host under a subpath, update the manifest `start_url`/`scope` and rewrite accordingly.

### Verify on Android

Deploy the app and open its HTTPS URL in current Chrome on Android. After the install prompt becomes available, tap **Install app** in the app header; Chrome may also offer **Install app** or **Add to Home screen** in its menu. Launch the installed icon and confirm it opens without browser chrome. Load the app once, then enable airplane mode and reopen it to verify the cached shell and the offline notice. LocalStorage records are available only in the same browser profile/device and are not synchronized.

### PWA limitations

- Installation prompts depend on the browser and its install criteria; some browsers only expose installation from their menu.
- The service worker caches static app files, not bank data, network API responses, or synchronization queues.
- The current application has no accounts, cloud database, or cross-device sync. Clearing site data can remove locally stored records.

## MVP limitations

- No bank syncing, authentication, server-side storage, cross-device sync, or exchange-rate conversion.
- LocalStorage availability and browser quota can limit persistence.
- Financial figures are derived from manually entered records. Total balance is lifetime income minus expenses; net savings follows the selected reporting period.
