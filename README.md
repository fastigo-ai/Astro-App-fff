# 🌸 AstroBaby — Vedic Garbhsanskar Pregnancy Companion

> *Every mantra, sweet melody & loving thought shapes your baby's mind.*

AstroBaby is a premium React Native (Expo) + Node.js application that guides expectant and planning mothers through personalized **Garbhsanskar** — the ancient Vedic practice of nurturing the unborn baby's mind, body, and spirit.

---

## 📱 App Overview

| Feature | Description |
|---|---|
| 🌐 **Bilingual** | Full Hindi / English i18n support |
| 🤰 **Pregnancy Tracking** | LMP-based month & trimester calculation |
| 🙏 **Garbhsanskar Plans** | Utkarsh (Full) & Aadhar (Half) subscription plans |
| 💳 **Razorpay Payments** | ACID-safe payment verification with rollback |
| 🎵 **Intro Video** | Sacred welcome journey after subscription |
| 👶 **Dashboard** | Baby growth, daily activities, womb bond card |

---

## 🗂️ Project Structure

```
astrobaby/
├── Astro/                          # React Native / Expo frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── navigation/
│   │   │   │   ├── AppStack.tsx        # Root navigator (Auth vs Main)
│   │   │   │   └── MainTabNavigator.tsx # Bottom tab navigator
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── screens/
│   │   │   │       ├── LanguageSelectScreen.tsx   # Step 0: Choose Hindi/English
│   │   │   │       ├── LoginScreen.tsx            # Phone OTP login
│   │   │   │       ├── ProfileSetupScreen.tsx     # Name / DOB setup
│   │   │   │       └── LifeStageScreen.tsx        # "Pregnant" vs "Planning" + LMP
│   │   │   ├── subscription/
│   │   │   │   └── screens/
│   │   │   │       └── PricingScreen.tsx          # Utkarsh & Aadhar plans + Razorpay
│   │   │   ├── onboarding/
│   │   │   │   └── screens/
│   │   │   │       └── IntroVideoScreen.tsx       # Sacred welcome video
│   │   │   ├── dashboard/
│   │   │   │   ├── screens/
│   │   │   │   │   └── DashboardScreen.tsx
│   │   │   │   └── components/
│   │   │   │       ├── DashboardHeader.tsx
│   │   │   │       ├── BabyGrowthCard.tsx
│   │   │   │       └── QuickToolsSection.tsx
│   │   │   ├── profile/
│   │   │   │   └── screens/
│   │   │   │       └── ProfileScreen.tsx
│   │   │   └── about/
│   │   │       └── screens/
│   │   │           ├── PrivacyPolicyScreen.tsx
│   │   │           └── TermsOfServiceScreen.tsx
│   │   ├── shared/
│   │   │   ├── api.ts                  # Axios instance with JWT refresh interceptor
│   │   │   └── i18n/
│   │   │       └── locales/
│   │   │           ├── en.json         # English translations
│   │   │           └── hi.json         # Hindi translations
│   │   └── store/
│   │       └── useAuthStore.ts         # Zustand auth + onboarding state
│   ├── app.json                        # Expo config
│   └── package.json
│
├── backend/                            # Express + TypeScript API server
│   ├── src/
│   │   ├── server.ts                   # Entry point
│   │   ├── app.ts                      # Express app setup, middleware, routes
│   │   ├── controllers/
│   │   │   ├── authController.ts       # OTP login, JWT issue & refresh
│   │   │   ├── subscriptionController.ts # Plans, Razorpay orders, ACID verify
│   │   │   ├── activityController.ts
│   │   │   ├── bumpController.ts
│   │   │   └── profileController.ts
│   │   ├── services/
│   │   │   ├── dbStore.ts              # JSON file DB + ACID transaction engine
│   │   │   └── razorpayService.ts      # Razorpay SDK wrapper + HMAC verification
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts       # JWT Bearer token guard
│   │   │   ├── errorHandler.ts         # Centralized error handler
│   │   │   ├── idempotency.ts          # Idempotency key middleware
│   │   │   └── rateLimiter.ts          # Rate limiting
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── subscriptionRoutes.ts
│   │   │   ├── activityRoutes.ts
│   │   │   ├── bumpRoutes.ts
│   │   │   └── profileRoutes.ts
│   │   └── models/
│   │       ├── Activity.ts
│   │       └── BabyBump.ts
│   ├── data/                           # JSON file-based data store (gitignored in prod)
│   ├── .env.example                    # ← Copy to .env and fill real values
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- [Razorpay account](https://dashboard.razorpay.com) with test keys

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Now edit .env and fill in JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# Start development server (ts-node-dev with hot reload)
npm run dev
# → Server starts on http://localhost:8000
```

**Required `.env` values:**

| Variable | Description |
|---|---|
| `JWT_SECRET` | Strong random secret (min 64 chars). Generate: `openssl rand -hex 64` |
| `RAZORPAY_KEY_ID` | `rzp_test_XXXX` for dev, `rzp_live_XXXX` for prod |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard |

---

### 2. Frontend (React Native / Expo) Setup

```bash
cd Astro

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on Android emulator
npx expo start --android

# Run on iOS simulator
npx expo start --ios
```

> ⚠️ **Backend URL**: The frontend connects to `http://10.0.2.2:8000` by default (Android emulator loopback to host). Update `Astro/src/shared/api.ts` if using a physical device or different host.

---

## 🔐 User Journey & Onboarding Flow

```
App Launch
    │
    ├── New User (first time)
    │       │
    │       ▼
    │   Language Select (Hindi / English)
    │       │
    │       ▼
    │   OTP Login (phone number)
    │       │
    │       ▼
    │   Profile Setup (name, DOB)
    │       │
    │       ▼
    │   Life Stage Selection
    │       ├── "I am already Pregnant"
    │       │       └── LMP / Pregnancy Month Input
    │       │               └── → Pricing Screen
    │       └── "I am planning for Pregnancy"
    │               └── → Pricing Screen
    │                       │
    │                       ▼
    │               [Utkarsh Full Plan] OR [Aadhar Half Plan]
    │                       │
    │               ┌───────┴────────┐
    │               │                │
    │           Choose Plan       Skip Trial
    │               │                │
    │         Razorpay Payment   3-Day Trial
    │               │                │
    │         ACID Verification       │
    │               │                │
    │         Sacred Celebration      │
    │               └────────┬────────┘
    │                        ▼
    │                 Intro Video
    │                        │
    │                        ▼
    │                   Home Dashboard
    │
    └── Returning User → Home Dashboard (if subscribed)
```

---

## 💳 Subscription Plans (from backend API)

### Utkarsh (उत्कर्ष) — Full Package
- **Coverage**: Till delivery (remaining months calculated from LMP)
- **Pricing**: Dynamic — ₹2499 base, adjusted per remaining months
- **Features**: Full Vedic daily activities, Live Yoga, Doctor consultations, Garbh Samvad audio

### Aadhar (आधार) — Half Package
- **Coverage**: 3 months foundation
- **Pricing**: ₹1499 (40% off ₹2499)
- **Features**: Core Garbhsanskar routine, recorded yoga, diet guidelines

---

## 🏦 Payment Architecture (ACID Guarantee)

```
Frontend                    Backend
─────────                   ─────────
1. POST /create-order   →   Generate Razorpay order
2. Razorpay Checkout    ←   Return orderId + keyId
3. User pays
4. POST /verify-payment →   ACID Transaction:
                              BEGIN (mutex lock)
                                1. Verify HMAC-SHA256 signature
                                2. Write to PaymentsCollection
                                3. Write to SubscriptionsCollection
                                4. Update UserJourneysCollection
                              COMMIT (or ROLLBACK on any failure)
5. Success/Failure      ←   Return result
```

**Razorpay Signature Verification:**
```
expected = HMAC-SHA256(KEY_SECRET, orderId + "|" + paymentId)
valid    = expected === signature from Razorpay webhook
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/send-otp` | Send OTP to phone |
| POST | `/api/v1/auth/verify-otp` | Verify OTP, issue JWT |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/profile` | Save user profile |

### Subscription
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/subscription/plans` | Get Utkarsh & Aadhar plans (dynamic pricing) |
| POST | `/api/v1/subscription/razorpay/create-order` | Create Razorpay order |
| POST | `/api/v1/subscription/razorpay/verify-payment` | Verify & activate with ACID |
| POST | `/api/v1/subscription/skip-trial` | Activate 3-day free trial |

---

## 🔒 Security Checklist

- [x] JWT tokens expire (15 min access, 30 day refresh)
- [x] JWT secret loaded from `process.env.JWT_SECRET` — throws if missing in production
- [x] Razorpay keys loaded from environment — never hardcoded
- [x] HMAC-SHA256 signature verification on every payment
- [x] ACID transaction with mutex lock and rollback for payments
- [x] Rate limiting middleware on all routes
- [x] Idempotency keys prevent double-charging
- [x] `.env` files excluded from git
- [x] `google-services.json` excluded from git
- [x] Compiled TypeScript (`.js`, `.d.ts`) excluded from git

---

## 🛠️ Development Scripts

### Backend
```bash
npm run dev          # Start with hot reload (ts-node-dev)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled output (production)
```

### Frontend
```bash
npx expo start       # Start Expo dev server
npx expo start --android   # Android
npx expo start --ios       # iOS
```

---

## 🌍 Internationalization (i18n)

The app supports **Hindi** and **English**. Translations live in:
- `Astro/src/shared/i18n/locales/en.json`
- `Astro/src/shared/i18n/locales/hi.json`

Language selection persists via AsyncStorage and applies across all screens.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native, Expo, TypeScript |
| State Management | Zustand |
| Navigation | React Navigation v6 |
| HTTP Client | Axios with JWT interceptor |
| Backend | Node.js, Express, TypeScript |
| Auth | JWT (jsonwebtoken) |
| Payments | Razorpay SDK + HMAC-SHA256 |
| Storage | JSON file store (dbStore) with ACID engine |
| i18n | i18next + react-i18next |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Copy `backend/.env.example` → `backend/.env` and fill in your keys
4. Commit changes: `git commit -m 'feat: your feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

> **Never commit real API keys, secrets, or `.env` files.**

---

## 📜 License

Private & Proprietary — AstroBaby © 2026. All rights reserved.

---

*Built with 🙏 and love for every mother and baby on their sacred journey.*
