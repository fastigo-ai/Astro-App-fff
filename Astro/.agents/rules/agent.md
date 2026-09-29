# Agent Guidelines & Guardrails

## Overview
This document defines the rules, best practices, and guardrails for any AI agents or developers contributing to the Astro React Native application. 

## App Building Rules

1. **Strict TypeScript Compliance**:
   - All new code must be written in TypeScript.
   - Avoid using `any`; define strict `Interfaces` or `Types` for API responses, component props, and state variables.
   
2. **Feature Encapsulation**:
   - When adding a new screen or component specific to a domain, place it inside the relevant `src/features/<feature-name>` directory.
   - Do not pollute the `src/shared` folder with feature-specific logic. Only truly reusable components (e.g., Custom Buttons, TextInputs) go into `shared`.

3. **State Management Protocol**:
   - Use **Zustand** for lightweight, ephemeral global state or simple shared states.
   - Use **Redux Toolkit** only when dealing with complex, interdependent state logic or heavy caching requirements.
   - Keep component-level state local using `useState` or `useReducer`.

4. **Styling and UI Aesthetics**:
   - Use the existing design system. Avoid inline styles unless absolutely necessary for dynamic calculations.
   - Do not introduce new CSS frameworks (e.g., Tailwind) unless explicitly requested. Use `StyleSheet.create` for styling.
   - Maintain a premium UI feel by reusing the app's established color palette, fonts, and spacing variables.

5. **Navigation**:
   - Always type route parameters properly using React Navigation's type definitions.
   - Avoid deeply nested navigators to prevent performance bottlenecks.

## Guardrails (Strict Limits)

1. **Do NOT Modify Native Code Unnecessarily**:
   - Avoid touching `/android` or `/ios` directories unless explicitly instructed to add a native module, update permissions in `AndroidManifest.xml` / `Info.plist`, or fix a native build issue.

2. **Dependency Management**:
   - Do not install new third-party libraries without checking if the functionality already exists in the project (e.g., don't add another fetching library if `axios` is already used).
   - If a new dependency is required, justify its usage to the user first.

3. **Error Handling & Resilience**:
   - All API calls must be wrapped in `try/catch` blocks or handle `.catch()`.
   - Never leave unhandled promise rejections.
   - Provide fallback UIs or Toast messages for network failures.

4. **Security & Sensitive Data**:
   - Never hardcode API keys, secrets, or passwords in the source code.
   - Use `react-native-keychain` for securely storing tokens, not `AsyncStorage`.

5. **Performance**:
   - Avoid unnecessary re-renders. Use `React.memo`, `useMemo`, and `useCallback` judiciously, but don't over-optimize prematurely.
   - Ensure flatlists and scrollviews are optimized with appropriate keys and item layouts.
