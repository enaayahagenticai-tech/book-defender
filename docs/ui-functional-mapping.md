# UI Functional Mapping: Book Defender

This document maps the user interface elements of the **Book Defender** mobile application to their respective underlying functionalities, stores, and API calls. Use this as a reference when redesigning the UI to ensure the core logic remains intact.

---

## 1. Authentication Screen (`frontend/app/(auth)/login.tsx`)

| UI Element | Action Type | Target Function / Store | Purpose |
| :--- | :--- | :--- | :--- |
| **Email Input** | Input | `setEmail(text)` | Capture user email. |
| **Password Input** | Input | `setPassword(text)` | Capture user password. |
| **AUTHENTICATE Button** | Press | `signInWithEmail()` | Authenticate user via Supabase. |
| **REQUEST CLEARANCE** | Press | `signUpWithEmail()` | Register a new user via Supabase. |

---

## 2. Command Center (HUD) (`frontend/app/(protected)/(tabs)/index.tsx`)

| UI Element | Action Type | Target Function / Store | Purpose |
| :--- | :--- | :--- | :--- |
| **Pull to Refresh** | Gesture | `refreshThreats()` | Refresh the list of active threats. |
| **DEPLOY SCOUT AGENT** | Press | `deployScoutAgent()` | Trigger a new system-wide scan. |
| **Threat Card** | View | N/A | Display threat details (Domain, Risk Score, Status). |

---

## 3. Takedown Interface (`frontend/app/(protected)/(tabs)/takedown.tsx`)

| UI Element | Action Type | Target Function / Store | Purpose |
| :--- | :--- | :--- | :--- |
| **Swipe Right** | Gesture | `resolveThreat(id)` | Mark threat as "Resolved" (Neutralize/Purge). |
| **Swipe Left** | Gesture | `ignoreThreat(id)` | Mark threat as "Ignored" (False Positive). |
| **Stack Visuals** | UI Logic | `useThreatStore.threats` | Renders a stack of active threats for review. |

---

## 4. Intel Registry (`frontend/app/(protected)/(tabs)/registry.tsx`)

| UI Element | Action Type | Target Function / Store | Purpose |
| :--- | :--- | :--- | :--- |
| **Search Bar** | Input | `setSearchQuery(text)` | Filter entries by domain or tags. |
| **Clear Search (X)** | Press | `setSearchQuery('')` | Reset the search filter. |
| **Pull to Refresh** | Gesture | `fetchEntries()` | Fetch updated logs from the registry store. |

---

## 5. Settings & Security (`frontend/app/(protected)/(tabs)/settings.tsx`)

| UI Element | Action Type | Target Function / Store | Purpose |
| :--- | :--- | :--- | :--- |
| **Biometric Lock Switch** | Toggle | `setBiometricsEnabled()` | Enable/Disable FaceID/TouchID requirement. |
| **Test Comms Button** | Press | `schedulePushNotification()` | Trigger a test alert to verify relay. |
| **TERMINATE SESSION** | Press | `signOut()` | Sign out and clear session tokens. |

---

## Core Store References

### `useThreatStore` (`frontend/lib/store/threats.ts`)
- **`threats`**: Array of threat objects.
- **`refreshThreats()`**: Sync with database.
- **`resolveThreat(id)`**: Update status to `resolved`.
- **`ignoreThreat(id)`**: Update status to `ignored`.

### `useAuthStore` (`frontend/lib/store/auth.ts`)
- **`signOut()`**: Terminate session.

### `useSecurityStore` (`frontend/lib/store/security.ts`)
- **`biometricsEnabled`**: Boolean flag.
- **`setBiometricsEnabled(val)`**: Persistence-enabled setter.
