# Finance Manager — Expense Tracker

A clean, minimal fintech-style Finance Manager app built with React Native. Manage income and expenses, track categories, and view monthly summaries — all stored locally on-device.

---

## Features

### Core
- Add income and expense transactions (amount, category, date, note)
- Form validation on all required fields
- Category-based tracking with color-coded icons (14 predefined categories)
- Monthly summary — total income, total expenses, remaining balance
- Gradient balance card with INR (₹) currency
- Dark / Light mode toggle (persisted across sessions)
- Bottom Tab Navigation (Home · Activity · Stats) with center FAB
- Micro-interactions and screen transition animations via Reanimated v3
- Swipe-to-delete transactions with confirm prompt
- Smooth keyboard handling on all form screens
- Smart empty states with contextual messaging
- Month filter chips to browse transaction history

### Bonus
- Animated donut chart for category spend breakdown (Stats screen)
- Per-category progress bars with percentage breakdown
- Pull-to-refresh on Home screen

### Storage
- All data stored locally using AsyncStorage — no backend, no network calls

---

## Screenshots

| Home | Transactions | Stats | Add Transaction |
|------|-------------|-------|-----------------|
| Balance card, recent transactions | Month filter, grouped list, swipe-delete | Donut chart, breakdown | Type toggle, category grid, date picker |

---

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.73.6 | Core framework |
| typescript | 5.0.4 | Type safety |
| @react-navigation/native | ^6.1.17 | Navigation |
| @react-navigation/bottom-tabs | ^6.5.20 | Tab navigation |
| @react-navigation/native-stack | ^6.9.26 | Stack navigation |
| react-native-reanimated | ^3.8.1 | Animations & micro-interactions |
| react-native-gesture-handler | ^2.16.0 | Swipe gestures |
| react-native-linear-gradient | ^2.8.3 | Gradient cards |
| react-native-vector-icons | ^10.0.3 | Category & UI icons |
| @react-native-async-storage/async-storage | ^1.23.1 | Local persistence |
| zustand | ^4.5.2 | State management |
| react-native-svg | ^15.2.0 | SVG support for charts |
| react-native-gifted-charts | ^1.4.20 | Donut chart |
| react-native-keyboard-aware-scroll-view | ^0.9.5 | Keyboard handling |

---

## Project Structure

```
src/
├── config/
│   ├── constants/         AppConstants.ts, AppDimensions.ts
│   ├── entities/          Transaction.ts, Category.ts (TypeScript interfaces)
│   ├── theme/             Colors.ts, Typography.ts, AppTheme.tsx (ThemeContext)
│   ├── utils/             CurrencyUtils.ts, DateUtils.ts, StorageUtils.ts
│   └── widgets/           GradientCard, AppButton, AppTextInput, CategoryBadge, EmptyState
├── core/
│   ├── home/              HomeScreen + BalanceCard, RecentTransactionItem
│   ├── transactions/      TransactionsScreen + TransactionItem (swipe), MonthFilter
│   ├── addTransaction/    AddTransactionScreen + TypeToggle, CategoryPicker, DateSelector
│   └── stats/             StatsScreen + DonutChart, CategoryBreakdownItem
├── navigation/            AppNavigator, BottomTabNavigator, NavigationService, RouterConfig
└── store/                 useTransactionStore (zustand + AsyncStorage)
```

---

## Setup & Installation

### Prerequisites

- Node.js >= 18
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS pod install)

### Quick Setup

```bash
# 1. Clone or navigate to project
cd ~/Downloads/flutter_projects/FinanceManager

# 2. Install JS dependencies
npm install

# 3. iOS — install pods
cd ios && pod install && cd ..

# 4. Run on iOS
npx react-native run-ios

# 5. Run on Android
npx react-native run-android
```

### Clean Rebuild (if icons show as question marks)

```bash
# iOS
cd ios && xcodebuild clean && cd ..
npx react-native run-ios --reset-cache

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android --reset-cache
```

---

## Bundle Identifiers

| Platform | ID |
|----------|-----|
| iOS | `com.spirit.financeapp` |
| Android | `com.spirit.financeapp` |

---

## Data Model

```typescript
interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number        // in INR (₹)
  categoryId: string
  date: string          // ISO string
  note: string
  createdAt: string
}
```

All transactions are stored as a JSON array in AsyncStorage under the key `@fm_transactions`.

---

## Categories

**Income:** Salary, Freelance, Investment, Business, Other

**Expense:** Food, Housing, Transport, Health, Fun, Shopping, Education, Utilities, Other

---

## Build Delivery

### Android APK

```bash
cd android
./gradlew assembleRelease
# APK output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS (TestFlight)

Open `ios/FinanceManager.xcworkspace` in Xcode → select a real device → Product → Archive → Distribute App → TestFlight

---

## GitHub Submission

Repo should include:
- This README with setup steps
- Full source code under `src/`
- `package.json` with all dependencies listed
- No `node_modules/` or build artifacts committed (add to `.gitignore`)
