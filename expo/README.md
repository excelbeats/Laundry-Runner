# Laundry Dispatch

A cross-platform (iOS, Android, Web) laundry pickup & delivery app built with **Expo Router** and **React Native**.

## Tech stack

- **Expo / React Native** – native iOS, Android, and web from one codebase
- **Expo Router** – file-based navigation (`app/`)
- **TypeScript** – type-safe throughout
- **React Query** (`@tanstack/react-query`) – data fetching & caching
- **Zustand** – lightweight state management
- **AsyncStorage** – local persistence
- **Lucide** – icons

> Data is currently served from local mocks in `mocks/data.ts`. Swap these for a real backend (e.g. Supabase) when ready.

## Getting started

Requires [Node.js](https://nodejs.org) and [Bun](https://bun.sh).

```bash
# Install dependencies
bun install

# Start the dev server, then press i (iOS), a (Android), or w (web)
bun run start

# Or target a platform directly
bun run ios
bun run android
bun run web
```

Scan the QR code with **Expo Go** to run on a physical device.

## Project structure

```
expo/
├── app/                      # Screens (Expo Router, file-based)
│   ├── (tabs)/               # Bottom-tab navigation (home, orders, track, profile)
│   ├── _layout.tsx           # Root navigation stack
│   ├── onboarding.tsx        # Onboarding flow
│   ├── schedule-pickup.tsx   # Schedule a pickup (modal)
│   ├── order-details.tsx
│   ├── order-tracking.tsx    # Live order tracking
│   ├── driver-dashboard.tsx
│   ├── admin-dashboard.tsx
│   └── notifications.tsx
├── assets/images/            # App icons & splash
├── constants/                # Theme & colors
├── hooks/                    # App state (useAppState)
├── mocks/                    # Mock data
├── types/                    # Shared TypeScript types
├── app.json                  # Expo configuration
└── package.json
```

## Building & releasing

Uses [EAS](https://docs.expo.dev/eas/):

```bash
bun i -g eas-cli
eas build:configure
eas build --platform ios        # or android
eas submit --platform ios       # or android
```

App identifiers (see `app.json`):

- iOS bundle ID / Android package: `com.excelbeats.laundrydispatch`
- Deep-link scheme: `laundrydispatch://`

## Linting

```bash
bun run lint
```
