# Database Schema: Book Defender

## Tables

### 1. `profiles`
Stores user-specific profile data and push notification tokens.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Ref: `auth.users` | Unique user identifier. |
| `username` | `text` | Unique, min 3 chars | User's handle. |
| `full_name` | `text` | | |
| `avatar_url` | `text` | | |
| `expo_push_token` | `text` | | Used for mobile notifications. |
| `updated_at` | `timestamp` | | |

### 2. `threats`
Main table for tracking illegal domains and takedown status.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default: `gen_random_uuid()` | Unique threat identifier. |
| `domain` | `text` | Not Null | The suspicious domain URL. |
| `riskScore` | `integer` | | 0-100 score of threat severity. |
| `status` | `text` | Default: `active` | One of: `active`, `pending`, `resolved`, `ignored`. |
| `created_at` | `timestamp` | Not Null | Detection timestamp. |

## Realtime Configuration
The `threats` table is enabled for **Supabase Realtime**, allowing the mobile app to receive immediate updates when new threats are added or existing ones are modified.
