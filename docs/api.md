# API & Store Reference

## Zustand Stores

### `useThreatStore`
Manages the lifecycle of threats in the application.
- **State**:
  - `threats`: `Threat[]`
  - `loading`: `boolean`
  - `error`: `string | null`
- **Actions**:
  - `refreshThreats()`: Fetches latest threats from Supabase.
  - `resolveThreat(id)`: Marks a threat as resolved (Purge).
  - `ignoreThreat(id)`: Marks a threat as ignored.
  - `addThreat(threat)`: Manually adds a new threat vector.

### `useToastStore`
Manages tactical on-screen notifications.
- **Actions**:
  - `showToast({ type, title, message })`: Displays a notification.

## Supabase Client (`lib/api/`)

### `threats.ts`
- `fetchThreats()`: GET `threats` ordered by `created_at` DESC.
- `updateThreatStatus(id, status)`: PATCH `threats` status.
- `createThreat(data)`: POST new threat to `threats` table.

## Realtime Channels
- **Table**: `public.threats`
- **Events**: `INSERT`, `UPDATE`
- **Channel**: `supabase_realtime`
