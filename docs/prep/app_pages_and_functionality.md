## App Pages & Functionality Blueprint

### App Summary  
**End Goal:** Help publishers and authors achieve automated detection and removal of book piracy to protect revenue.
**Core Value Proposition:** Stop revenue loss with automated "Search & Destroy" piracy protection and active counter-intelligence.
**Target Users:** Independent Authors, Rights Managers (Publishers), System Administrators.
**Template Type:** adk-agent-saas

---

## 🌐 Universal SaaS Foundation

### Public Marketing Pages
- **Landing Page** — `/` 
  - Hero: "Automated Piracy Protection for Authors & Publishers"
  - Feature showcase: Autonomous Scanning, One-Click DMCA, Shadow-Drop Counter-Intel
  - Pricing: Indie ($19/mo) vs Rights Manager ($99/mo)
  - CTA: "Start Your Free Scan"

- **Legal Pages** — `/privacy`, `/terms`, `/cookies`
  - Privacy policy, Terms of service, Cookie policy
  - Essential for GDPR compliance and SaaS operations

### Authentication Flow
- **Login** — `/auth/login` (Email/password, OAuth)
- **Sign Up** — `/auth/sign-up` (Account creation)  
- **Forgot Password** — `/auth/forgot-password` (Password reset flow)
- **Sign Up Success** — `/auth/sign-up-success` (Confirmation page)

---

## ⚡ Core Application Pages

### Dashboard & Intelligence
- **Dashboard** — `/dashboard`
  - Summary Cards: Active Titles, Takedowns Sent (30d), Est. Revenue Saved
  - Recent Threat Alerts (High/Critical risk items)
  - **Role Diff:** Rights Managers see aggregate stats across all 20 titles

### Asset Protection
- **My Titles** — `/titles`
  - List active titles with "Protection Status" (Active/Paused)
  - **Add Title Form:** Input Title, Author, ISBN, Cover Image
  - **Functionality:** Enforce tier limits (5 for Indie, 20 for Rights Manager)
  - **Background Job:** Trigger "Initial Scan" immediately upon adding

- **Title Details** — `/titles/[titleId]`
  - Edit title metadata
  - View scan history and specific threat logs for this title

### Threat Response
- **Review Takedowns** — `/takedowns`
  - List detected links with "Piracy Grade" (Risk Score)
  - **Actions:**
    - "Approve DMCA" (Triggers sending notice)
    - "Ignore/Allow" (Dismisses or adds to allowlist)
    - "Deploy Shadow-Drop" (MVP Feature: Triggers decoy file seeding)
  - **Detail View:** Show screenshot evidence captured by agent

### Analytics & Reporting
- **Reports** — `/reports`
  - Charts: "Takedowns over Time," "Success Rate by Domain"
  - Export PDF summary (Vital for Rights Managers/ROI proof)
  - **Access Control:** Available to Rights Managers only

### User Account  
- **Profile & Settings** — `/profile`
  - Account details, Plan management (Link to Stripe Portal)
  - **Notifications:** Configure Tiered Alerts (Immediate vs Daily) hierarchy

- **Allowlist** — `/settings/allowlist`
  - Add/Remove domains to exclude from scans (e.g., `amazon.com`, `myblog.com`)

---

## 💰 Business Model Pages

### Billing & Subscription
- **Subscription Management** — Integrated within `/profile`
  - Display "Current Plan: [Tier]", "Titles Used: X/[Limit]"
  - Manage Subscription button -> Stripe Customer Portal
  - **Logic:** Real-time subscription check via Stripe API

---

## 👑 Admin Features (System Ops)

### Admin Section — `/admin`
- **Domain Master List** — `/admin/domains`
  - CRUD operations for target piracy sites (Global Blocklist/Targetlist)
- **System Health** — `/admin/health`
  - View active agent jobs, failure rates, queue status
- **Global Takedowns** — `/admin/takedowns`
  - Override/Retry failed DMCA requests manually

---

## 📱 Navigation Structure  

### Main Sidebar (Responsive)
- **Dashboard** (ROI & Alerts)
- **My Titles** (Asset Mgmt)
- **Review Takedowns** (Work Queue)
- **Reports** (Analytics - Rights Managers)
- **Settings** (Profile/Allowlist)

### Admin Navigation (Separate Mode)
- **Domain Master List**
- **System Health**
- **Global Takedowns**

### Mobile Navigation  
- Collapsible sidebar
- Bottom bar priority: Dashboard, Takedowns, Titles (quick access to key review tasks)

---

## 🔧 Next.js App Router Structure

### Layout Groups
```
app/
├── (public)/          # Marketing and legal pages
├── (auth)/             # Authentication flow  
├── (protected)/        # Main authenticated app (Indie/Rights Roles)
├── (admin)/            # Admin-only pages
└── api/                # Backend endpoints
```

### Complete Route Mapping
**🌐 Public Routes**
- `/` → Landing page
- `/privacy`, `/terms`, `/cookies` → Legal

**🔐 Auth Routes**
- `/auth/login`, `/auth/sign-up`
- `/auth/forgot-password`, `/auth/sign-up-success`

**🛡️ Protected Routes**  
- `/dashboard` → Main ROI & Status
- `/titles` → Title Management List
- `/titles/[titleId]` → Edit Title / History
- `/takedowns` → Main Review Queue
- `/reports` → Analytics & Export
- `/profile` → Unified Account/Billing
- `/settings/allowlist` → Domain Allowlist

**👑 Admin Routes (Role-Based)**
- `/admin/domains` → Master Piracy Domain List
- `/admin/health` → Agent Status
- `/admin/takedowns` → Global Oversight

**🔧 Backend Architecture**

**API Endpoints**
- `/api/webhooks/stripe/route.ts` → Subscription lifecycle

**Server Actions**
- `app/actions/titles.ts` → Add/Edit titles, Trigger Scan (Limit Check)
- `app/actions/takedowns.ts` → Approve DMCA, Ignore, **Deploy Shadow-Drop**
- `app/actions/admin.ts` → Manage Master Domains

**Lib Queries**
- `lib/queries/scans.ts` → Fetching results, risk scores
- `lib/queries/users.ts` → Permission checks, Tier limits

---

## 🎯 MVP Functionality Summary

This blueprint delivers your core value proposition: **Stop revenue loss via automated "Search & Destroy" protection.**

**Phase 1 (Launch Ready):**
- Universal SaaS foundation (auth, legal)
- **Action Loop:** Dashboard → Add Title → Scan (Background) → Review Takedown → Approve/Shadow-Drop
- **Differentiation:** Active "Shadow-Drop" counter-measure
- **Business Logic:** Enforced 5 vs 20 title limits via Stripe & DB
- **Admin Ops:** Global Domain List management

**Phase 2 (Growth Features):**  
- Honey Pot Link Tracking (Advanced Counter-Intel)
- SEO Displacement Tips
- Enterprise Team Management (Multiple Logins per Account)

> **Next Step:** Ready for wireframe design with this concrete blueprint
