# SentinelAI Mobile Surveillance App - Architecture Blueprint

## 1. Executive Summary
The SentinelAI Mobile App ("Sentinel Scout") is a high-security, native command interface designed for on-the-go threat management. It extends the "Command Center" philosophy to iOS and Android devices, enabling administrators to receive real-time tactical alerts, authorize takedowns via biometric verification, and monitor the global threat landscape from anywhere.

## 2. Technology Stack
*   **Framework**: React Native with **Expo SDK 50+** (Managed Workflow)
    *   *Rationale*: fast iteration, OTA updates, excellent native module support.
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: **NativeWind (Tailwind CSS)**
    *   *Rationale*: Shared design system with the web platform (`apps/web/globals.css` can be adapted).
*   **State Management**: React Query (TanStack Query) + Zustand
*   **Backend / Auth**: Supabase (Shared instance with Web)
*   **Navigation**: Expo Router v3 (File-based routing similar to Next.js)

## 3. Core Modules & Features

### A. Authentication & Security (The "Airlock")
*   **Biometric Entry**: FaceID / TouchID integration for app access.
*   **Secure Storage**: Encryption of session tokens using `expo-secure-store`.
*   **Session Timeout**: Auto-lock after 5 minutes of inactivity.

### B. Command Dashboard ("Pocket Command")
*   **Tactical HUD**: High-contrast summary of Active Threats, Pending Takedowns, and System Health.
*   **Live Stream**: WebSocket connection to the Python analysis agent for real-time scan logs.

### C. Threat Management
*   **Takedown Swipe**: Tinder-style "Swipe to Purge" interface for verifying takedown candidates.
    *   *Swipe Right*: Authorize Takedown (triggers API).
    *   *Swipe Left*: Mark as False Positive.
*   **Push Notifications**: "Mission Critical" alerts for high-confidence detections.
    *   *Actionable Notifications*: Long-press to Takedown directly from the lock screen.

### D. Scanner & Intel
*   **Manual Scan Trigger**: "Deploy Scout Agent" button to initiate immediate domain scans.
*   **Domain Registry**: Mobile view of the "Target Vector Registry" for quick status checks.

## 4. Design System ("Sentinel Mobile")
*   **Theme**: Dark Mode Only (OLED optimized).
*   **Visuals**: Glass-morphism overlays, scanning lines, haptic feedback (using `expo-haptics`) for all interactions.
*   **Typography**: Inter (System font fallback) with rigid, military-style headers.

## 5. Directory Structure (`apps/mobile`)
```
apps/mobile/
├── app/                  # Expo Router pages
│   ├── (auth)/          # Login / Biometrics
│   ├── (protected)/     # Dashboard, Takedowns, Settings
│   └── _layout.tsx      # Root layout / Providers
├── components/           # Reusable UI (Adapting shadcn/ui concepts)
│   ├── ui/              # Buttons, Cards, Inputs
│   └── tactical/        # Scanner lines, HUD elements
├── lib/
│   ├── api/             # Supabase client & API hooks
│   ├── store/           # Zustand stores
│   └── utils.ts         # Haptics, Formatters
└── assets/              # Icons, Splashes
```

## 6. Implementation Phases
1.  **Phase 1: Foundation**: Initialize Expo project, configure NativeWind, setup Supabase Auth.
2.  **Phase 2: Core UX**: Build the Dashboard HUD and Navigation structure.
3.  **Phase 3: Takedown Module**: Implement the "Swipe to Purge" interface.
4.  **Phase 4: Forensics**: Add Push Notifications and Biometric Security.
