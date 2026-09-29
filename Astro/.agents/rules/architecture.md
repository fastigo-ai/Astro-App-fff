# Astro App Architecture

## Overview
Astro is a React Native mobile application built with TypeScript, adopting a feature-based architecture pattern. This structure ensures high modularity, scalability, and ease of maintenance as the application grows.

## Tech Stack
- **Framework**: React Native (v0.86.0)
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs, Native Stack)
- **State Management**: Redux Toolkit & Zustand
- **Networking**: Axios
- **Storage**: AsyncStorage, Keychain (Secure Storage)
- **Localization**: i18next
- **UI/Styling**: Lucide React Native, React Native SVG

## Directory Structure

```
src/
├── app/          # App-wide configurations and setup
│   └── navigation/ # React Navigation stacks and tab navigators
├── assets/       # Static assets like images, fonts, etc.
├── features/     # Feature-based modules (Core logic of the app)
│   ├── about/
│   ├── auth/
│   ├── contact/
│   ├── course/
│   ├── dashboard/
│   ├── debug/
│   ├── onboarding/
│   ├── profile/
│   └── subscription/
├── shared/       # Shared UI components, hooks, utils, and constants
└── store/        # Global state management setup (Redux slices, Zustand stores)
```

## Architectural Patterns

### Feature-Driven Development
The app is organized by feature rather than by technical concern (e.g., all components in one folder, all reducers in another). Each feature folder (e.g., `features/auth`) encapsulates its own components, hooks, services, and local state.

### State Management
- **Zustand**: Used for simpler, localized, or cross-cutting global state (e.g., UI toggles, simple auth state) to reduce boilerplate.
- **Redux Toolkit**: Used for complex state management requiring strict predictability, side-effects, or extensive caching.

### Navigation Strategy
The app uses React Navigation. The routing is centralized in `src/app/navigation`, typically split into:
- **AuthStack**: Screens for unauthenticated users (Login, Signup, Onboarding).
- **AppStack / MainTabNavigator**: Screens for authenticated users, often utilizing Bottom Tabs for primary navigation.

### Networking
API calls are handled using `axios`. Interceptors should be used for attaching auth tokens and centralized error handling.

## Code Conventions
- Prefer Functional Components with Hooks.
- Use explicit types or interfaces for all props, state, and API responses.
- Keep components small and focused on a single responsibility.

## Onboarding & Progressive Profiling Flow
To maximize sign-up completion and preserve user trust, Astro strictly follows a **Progressive Profiling** approach. Data is collected *only* when it is required for a feature.

### Step 1: Frictionless Sign-Up
- **Required**: Phone number + OTP verification.
- **Optional**: Name and Preferred Language (can be skipped).
- *Rationale*: Prevents user drop-off caused by overwhelming upfront data collection.

### Step 2: Core Categorization
- **Single Question**: "Which of these best describes you?"
  1. Pregnant
  2. Planning a baby, no issues
  3. Facing difficulty getting pregnant
- **Conditional Follow-up**: If *Pregnant*, ask for Due Date or Last Period Date (to auto-calculate the month). Optional: First pregnancy? Twins?
- *Rationale*: This single question is enough to suggest the right program (Beej Sanskar, Garbhadhana Sanskar, or Garbh Sanskar) without restricting access to other parts of the app.

### Step 3: Just-In-Time (JIT) Data Collection
Extra questions are presented via modals or interceptor screens *right before* a user accesses a dependent feature.
- **Mantra / Astrology Feature**: Prompt for Birth Date, Time, and Place (Self & Partner).
- **Beej Sanskar (Fertility)**: Prompt for medical conditions (PCOS, low sperm count, etc.). Must be strictly optional with a clear "Skip" button due to medical sensitivity.
- **Garbhadhana Sanskar (Planning)**: Prompt for cycle regularity, length, and last period date (optional).
- **Garbh Sanskar (Payment)**: Re-confirm pregnancy month prior to checkout to ensure accurate pricing.
- **Consultations**: Only require Date and Time slot selection.

*Rationale*: Users are more willing to share sensitive medical or astrological data when they understand the immediate context. Less upfront data collection equals higher trust and lower churn.
