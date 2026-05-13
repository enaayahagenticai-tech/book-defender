# SentinelAI Page Navigation & Routes

## App Structure & Routing

### Public Routes (Unauthenticated)
- `/` - **Landing Page**: Features, "Search & Destroy" concept, Pricing, CTA.
- `/login` - **Auth**: Supabase Auth (Email/Google).
- `/signup` - **Auth**: Account creation with plan selection.
- `/pricing` - **Marketing**: Plan details (Indie Author vs Rights Manager).
- `/terms` - Terms of Service.
- `/privacy` - Privacy Policy.

### Protected Routes (Authenticated Users)

#### 1. Core Workflow (Assets)
- `/titles` - **My Titles (Home)**:
  - List of protected books.
  - "Add Title" modal (ISBN/ASIN input).
  - Status summary ("Scanning", "Protected", "Under Attack").
- `/titles/[id]` - **Title Details**:
  - Deep dive into a specific book.
  - History of scans and actions.

#### 2. Intelligence (The Hunt)
- `/dashboard` - **Command Center**:
  - High-level metrics: Active Takedowns, ROI ($ Saved), Pirates Neutralized.
  - "Recent Alerts" widget.
- `/takedowns` - **Takedown Review (Kanban)**:
  - Columns: `Pending`, `Approved`, `Sent`, `Ignored`.
  - Action interface: "Approve DMCA", "Shadow Drop", "Ignore".

#### 3. Administration (Admin Role Only)
- `/admin/domains` - **Global Target List**:
  - Master list of pirate domains to scan.
  - Add/Remove domains.
  - Domain Health Status (Is it down?).

#### 4. Account
- `/settings` - **User Settings**:
  - Profile info.
  - Notification preferences.
- `/settings/billing` - **Subscription**:
  - Stripe portal integration.
  - Limit usage/upgrade prompts.

### API Routes (Next.js)

#### Webhooks (Agent Integration)
- `/api/webhooks/scan-result` - **Scout Agent Callback**: Receives findings from the crawler.
- `/api/webhooks/action-result` - **Action Agent Callback**: Receives status updates from the enforcer.
- `/api/webhooks/stripe` - **Billing**: Handles subscription updates.

#### Agent Triggers
- `/api/trigger/scan` - **Manual Scan**: Triggered by user button.
- `/api/trigger/action` - **Execute Takedown**: Triggered by user approval.

### Navigation Components

#### Sidebar (Authenticated)
```
Header: [SentinelAI Logo]
Nav:
  - 📚 My Titles (Home)
  - 🛡️ Takedowns
  - 📊 Dashboard
  - ⚙️ Settings
Footer: [User Avatar]
```

### URL Structure Examples
```
/ (Landing)
/titles (Asset Manager)
/takedowns (The Kill Queue)
/dashboard (ROI)
/admin/domains (Targeting)
```
