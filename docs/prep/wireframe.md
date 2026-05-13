# SentinelAI - Design Framework & Wireframes (Phase 2)
*Updated: 2026-02-06 | Status: Design Phase Initiation*

## 🎨 Visual Identity: "The Digital Fortress"
**Core Philosophy:** SentinelAI is an active defense system. The UI should feel like a command center—dark, sleek, and data-dense but not cluttered.

### Color Palette (Implemented)
- **Primary (Electric Blue):** `hsl(215 90% 50%)` - Used for primary actions, active states, and "safe" indicators.
- **Background (Gunmetal):** `hsl(222 47% 11%)` - Deep, rich blue-grey for dark mode. Not pitch black.
- **Danger (Threat Red):** `hsl(0 84% 60%)` - Used strictly for piracy confirmation and critical risks.
- **Success (Secure Green):** `hsl(142 76% 36%)` - Verified takedowns and healthy states.

---

## 📐 Core Layout Wireframes

### 1. App Shell (Protected Layout)
```text
+----------------------------------------------------------------+
| [Sidebar: Gunmetal 900]                                        |
|                                                                |
|  [Logo: SentinelAI]                                            |
|                                                                |
|  NAV:                                                          |
|  [icon] Dashboard                                              |
|  [icon] My Titles                                              |
|  [icon] Takedowns  [Badge: 3 New]                              |
|  [icon] Reports                                                |
|                                                                |
|  [Spacer]                                                      |
|                                                                |
|  [User Profile]                                                |
|  [Usage Stats: "Indie Plan"]                                   |
|  [Bar: 3/5 Titles Used]                                        |
+----------------------------------------------------------------+
| [Header]                                                       |
|  [Breadcrumbs]                                [Theme Toggle]   |
+----------------------------------------------------------------+
| [Main Content Area: Canvas]                                    |
|                                                                |
| (Content rendered here on Gunmetal 950 bg)                     |
|                                                                |
+----------------------------------------------------------------+
```

### 2. Dashboard (`/dashboard`)
**Goal:** Instant Situation Awareness.

```text
[Header: "Command Center"]

[Row 1: Key Metrics Cards (Glassmorphism)]
+----------------+ +----------------+ +----------------+
| Active Titles  | | Threats Cleaned| | Revenue Saved  |
| [Icon: Book]   | | [Icon: Shield] | | [Icon: Dollar] |
|     5          | |     142        | |    $3,450      |
+----------------+ +----------------+ +----------------+

[Row 2: Split View]
+------------------------------------+ +--------------------------------+
| Recent Critical Alerts (Table)     | | Intelligence Map (Live Feed)   |
| [!] Title A | pirate.com | High    | | [Map Visual of Detections]     |
| [!] Title B | blog.ru    | Med     | |                                |
| (Action: Quick Review)             | | "New mirror detected in RU"    |
+------------------------------------+ +--------------------------------+
```

### 3. Title Details (`/titles/[id]`)
**Goal:** Deep dive into a specific asset's protection status.

```text
[Header: "The Art of War" (Title)]  [Status: PROTECTED (Green Pulse)]
[Btn: Scan Now]

[Row 1: Health & Threats]
+---------------------------+  +-------------------------------------+
| Shield Score (Donut Chart)|  | Active Threat Intelligence          |
|        95%                |  | [Card: Market Pressure - HIGH]      |
| "Brand Integrity Level"   |  | [Card: Critical Leaks - 2]          |
|                           |  | [Card: Recovery Val - $500]         |
+---------------------------+  +-------------------------------------+

[Row 2: Tabs (Detected Content | Scan History)]
+----------------------------------------------------------------+
| [Table: Detected Links]                                        |
| [ ] | URL               | Risk      | Status       | Actions   |
| [x] | pirate.com/pdf    | CRITICAL  | Pending      | [Confirm] |
| [ ] | forum.net/thread  | LOW       | Ignored      | [...]     |
+----------------------------------------------------------------+
```

### 4. Takedown Review (`/takedowns`)
**Goal:** High-volume processing queue.

```text
[Filter Bar: Pending (Active) | History | High Risk Only]
[Bulk Actions: (3 Selected) -> Approve Takedown]

+----------------------------------------------------------------+
| List Item (Card Style)                                         |
| Title: "The Art of War"                                        |
| Source: libgen.is/book/12398                                   |
| Detected: 2 hours ago                                          |
| Risk: CRITICAL (PDF Match)                                     |
| Evidence: [View Screenshot]                                    |
|                                                                |
| [Btn: Confirm Piracy (Send DMCA)]  [Btn: Ignore] [Btn: Shadow] |
+----------------------------------------------------------------+
```

---

## 🛠 UX Interaction Patterns

### The "Pulse" Indicator
- Use a subtle CSS animation on the "Protected" badge to indicate active monitoring.
- **Reference:** `animate-pulse` in Tailwind.

### Status Transitions
- When a user clicks "Confirm Piracy":
  1. Row performs an "optimistic update" (fades out or changes state immediately).
  2. Toast notification: "Takedown Initiated".
  3. Background process handles the API call.

### Empty States
- Don't just show "No Data".
- Show: "All Quiet on the Western Front. No threats detected." with a calming illustration.

## 📝 Implementation Checklist (Design Phase)
1. **Typography:** Ensure `Lexend Deca` is used for Headings, `Inter` (or default sans) for body, `JetBrains Mono` for data/code.
2. **Contrast:** Verify text contrast on the new Gunmetal background.
3. **Borders:** Use subtle borders (`border-white/10`) for cards in dark mode to separate them from the background.
