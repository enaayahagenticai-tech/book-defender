# Coding Rules & Standards

## 1. General Principles
- **TypeScript First**: All new code must be written in TypeScript with strict type checking.
- **Atomic Components**: Break UI into small, reusable components in `components/ui`.
- **Logic Separation**: Keep UI components clean; move business logic into custom hooks or Zustand stores.

## 2. Frontend (Mobile)
- **Styling**: Use **NativeWind** (Tailwind CSS) for all styling. Avoid inline styles.
- **State Management**: Use **Zustand** for global state (e.g., threats, auth).
- **Navigation**: Use **Expo Router** (file-based navigation).
- **Icons**: Use `@expo/vector-icons` (prefer FontAwesome).

## 3. Data Flow
- **Optimistic Updates**: UI should update immediately on user action; rollback on API failure.
- **Realtime**: Use Supabase subscriptions for live data rather than frequent polling.

## 4. Design System
- **Theme**: Dark mode only (OLED optimized).
- **Visuals**: Use glass-morphism and tactical aesthetics.
- **Haptics**: Always provide haptic feedback for critical user actions (takedowns, errors).

## 5. Security
- **Biometrics**: Sensitive operations (e.g., authorizing a purge) must use `expo-local-authentication`.
- **Sensitive Data**: Never store raw tokens in AsyncStorage; use `expo-secure-store`.
