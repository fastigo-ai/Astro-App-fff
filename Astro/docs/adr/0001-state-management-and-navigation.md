# 1. State Management and Navigation Decisions

Date: 2026-07-22

## Status
Accepted

## Context
GarbhCompanion requires a scalable, feature-first architecture capable of handling bilingual support (English/Hindi) and light but content-heavy screens. For this setup, we need a robust state management layer and a flexible routing solution.

## Decisions

### 1. State Management: Zustand over Redux Toolkit
We decided to adopt **Zustand** instead of Redux Toolkit + RTK Query for global state management.
* **Reasoning**:
  * **Minimal Boilerplate**: Zustand provides a hook-based API with virtually no boilerplate, aligning with the team's preference for simplicity.
  * **Performance**: Zustand avoids unnecessary re-renders more easily than Context API and is generally lighter than Redux.
  * **Feature-first Alignment**: Zustand allows us to create multiple decentralized, feature-specific stores (e.g., `useAuthStore`, `useSubscriptionStore`) easily instead of a monolithic centralized store, though a centralized pattern is also possible.
  * **Network Handling**: While RTK Query offers built-in caching and data fetching, we are pairing Zustand with a dedicated Axios wrapper (and potentially React Query in the future if advanced caching is required). This separation of UI state (Zustand) and Server state is increasingly the modern standard.

### 2. Navigation: React Navigation v6
We selected **React Navigation v6** for handling routing.
* **Reasoning**:
  * **Native Performance**: `@react-navigation/native-stack` uses `react-native-screens` under the hood for true native navigation transitions and performance.
  * **TypeScript Support**: Full support for strict route typing through `RootStackParamList`.
  * **Separation of Concerns**: We've split our navigation into logically separate layers: `AuthStack`, `OnboardingStack`, and `MainTabNavigator`. This allows conditionally rendering the entire navigator tree based on the user's `AuthStore` state, preventing unauthorized access and minimizing the navigator tree size.

## Consequences
* New developers will need to learn the Zustand API instead of Redux, though the learning curve is exceptionally low.
* All routes must be strictly typed in `RootStackParamList` before they can be navigated to, which improves safety but adds a small initial step when creating new screens.
