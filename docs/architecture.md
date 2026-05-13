# Architecture: Book Defender (SentinelAI)

## 1. System Overview
Book Defender is a surveillance platform for digital rights protection. It uses a mobile-first approach to allow administrators to monitor and act on piracy threats in real-time.

## 2. Component Diagram
```mermaid
graph TD
    A[Mobile Client (React Native/Expo)] -->|Auth/Realtime| B[Supabase Backend]
    B -->|Database| C[(PostgreSQL)]
    D[Scout Agents (Python/AI)] -->|Insert Threats| B
    B -->|Notify| A
```

## 3. Tech Stack
- **Frontend**: React Native, Expo, NativeWind, Zustand, React Query.
- **Backend**: Supabase (Auth, DB, Realtime).
- **Security**: Biometric verification (FaceID/TouchID).

## 4. Key Workflows
### Threat Detection & Action
1. Scout agents identify suspicious domains.
2. Threat data is persisted in Supabase `threats` table.
3. Mobile app receives real-time update via Supabase Realtime.
4. Administrator reviews threat in "Takedown" swipe interface.
5. swipe Right triggers `updateThreatStatus` to `resolved`.
