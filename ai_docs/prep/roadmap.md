# SentinelAI Development Roadmap

## 🚨 Phase 0: Project Setup (MANDATORY FIRST STEP)
**Goal**: Prepare development environment and understand current codebase
**⚠️ CRITICAL**: This phase must be completed before any other development work begins
- [ ] **REQUIRED**: Run `setup.md` using **gemini-2.5-pro** on **max mode** for maximum context to initialize the template environment

---

## Phase 1: Core Data & Asset Foundation
**Goal**: Establish the "Asset Protection" database structure and allow users/admins to populate the system with Books and Target Domains.

### 1. Database Schema Transformation
[Goal: Replace chat-based template schema with SentinelAI asset protection schema]
- [ ] Delete `drizzle/schema/session-names.ts` and `drizzle/schema/usage-events.ts` (Remove Chat/Usage boilerplate)
- [ ] Update `drizzle/schema/users.ts` to add `plan_tier` ('free', 'indie', 'rights_manager') and `active_titles_count` fields
- [ ] Create `drizzle/schema/titles.ts` for Book assets (user_id, title, author, isbn, cover_url, status)
- [ ] Create `drizzle/schema/pirate-domains.ts` for Admin Master List (domain, risk_level, is_active)
- [ ] Create `drizzle/schema/active-scans.ts` for Job Logs (title_id, status, links_found_count)
- [ ] Create `drizzle/schema/detected-links.ts` for the Takedown Queue (title_id, domain_id, url, piracy_grade, status, screenshot_url, shadow_drop_payload)
- [ ] Run `npm run db:generate` and `npm run db:push` to apply schema changes

### 2. Asset Management (Users)
[Goal: Allow authors to add the books they want to protect]
- [ ] Update Navigation in `components/sidebar-layout.tsx` (Add "My Titles", "Dashboard", "Takedowns")
- [ ] Create `app/(protected)/titles/page.tsx` (List View of User's Books)
- [ ] Create `components/titles/add-title-modal.tsx` (Form to input Title/ISBN)
- [ ] Create `app/actions/titles.ts` (Server Actions: `createTitle`, `getTitles`, `deleteTitle`)
- [ ] Implement `active_titles_count` increment logic in `createTitle` action to enforce plan limits

### 3. Global Intelligence (Admins)
[Goal: Allow admins to manage the Master List of pirate sites to scan]
- [ ] Create `app/(protected)/admin/domains/page.tsx` (Table of Pirate Domains)
- [ ] Create `app/actions/admin-domains.ts` (Server Actions: `addDomain`, `toggleDomainStatus`)
- [ ] Implement Role-Based Access Control check in `admin/domains` page (Redirect if not 'admin' role)

---

## Phase 2: The Scout System (Hunter Agent)
**Goal**: Implement the "Scout Agent" in ADK to crawl target domains and populate the database with detected piracy risks.

### 1. Scout Agent Implementation (ADK)
[Goal: precise "Search & Detect" agent logic]
- [ ] Create `apps/scout-agent/agents/scout.py` (LlmAgent configuration)
- [ ] Implement `tools/crawler_tool.py` (Basic requests/BeautifulSoup logic to fetch page content)
- [ ] Implement `tools/piracy_grader_tool.py` (Logic to grade risk: 'Critical' if PDF download found, 'Low' if just blog mention)
- [ ] Update `apps/scout-agent/agent.py` to route "SCAN_JOB" triggers to the Scout Agent

### 2. Next.js -> ADK Trigger Integration
[Goal: Connect the Web App "Scan Now" button to the Python Agent]
- [ ] Create `app/api/webhooks/scan-result/route.ts` (API to receive results from ADK Agent)
- [ ] Create `lib/adk/scan-service.ts` (Service to dispatch jobs to ADK `run` endpoint)
- [ ] Add "Scan Now" button to `app/(protected)/titles/page.tsx` that triggers the scan service
- [ ] Update `apps/scout-agent/agents/scout.py` to POST results back to `app/api/webhooks/scan-result` (The Callback Pattern)

### 3. Scan Results Processing
[Goal: Save the agent's findings into the Takedown Queue]
- [ ] Implement logic in `app/api/webhooks/scan-result` to Insert rows into `detected_links` table
- [ ] Update `active_scans` table status to 'completed' upon callback

---

## Phase 3: Review & Action (The Kill Chain)
**Goal**: Build the interface for users to review findings and trigger the "Action Agent" to execute Takedowns.

### 1. Takedown Review Dashboard
[Goal: High-efficiency review queue for users]
- [x] Create `app/(protected)/takedowns/page.tsx` (Kanban or List view of `detected_links`)
- [x] Implement Filtering (Status: Pending vs Approved, Grade: Critical vs Low)
- [x] Create `app/actions/takedowns.ts` (Server Actions: `approveTakedown`, `ignoreLink`) -> Implemented as `detected-links.ts`

### 2. Action Agent Implementation (ADK)
[Goal: Automated execution of approved decisions]
- [x] Create `apps/scout-agent/agents/action.py` (LlmAgent for generating notices) -> Implemented as `sub_agents/action/agent.py`
- [x] Implement `tools/dmca_generator.py` (Template filler for legal notices) -> Implemented in `tools/dmca_tool.py`
- [x] Implement `tools/shadow_drop_deployer.py` (Simulated tool: Generating a "Decoy" URL) -> Implemented in `tools/decoy_tool.py`
- [x] Update `apps/scout-agent/agent.py` to route "EXECUTE_ACTION" triggers to Action Agent -> Main agent router updated

### 3. Execution Trigger
[Goal: "One-Click" execution from the dashboard]
- [x] Connect "Approve & Execute" button in Takedown Dashboard to trigger `Action Agent`
- [x] Implement `app/api/webhooks/action-result/route.ts` to handle completion status from Action Agent
- [x] Update `detected_links` status to 'takedown_sent' or 'shadow_dropped' upon success callback

---

## Phase 4: Analytics & Polish (ROI Proof)
**Goal**: Demonstrate value to the user through high-level metrics and finish UI polish.

### 1. Main Dashboard
[Goal: "At a Glance" value proposition]
- [x] Create `app/(protected)/dashboard/page.tsx`
- [x] Implement `getDashboardMetrics` server action (Count active titles, total takedowns, revenue saved - estimated)
- [x] Create "Recent Alerts" widget (Top 5 critical pending links)

### 2. Reporting
[Goal: Downloadable proof of work]
- [x] Create `app/(protected)/reports/page.tsx`
- [x] Implement "Export CSV" functionality for Takedown History
- [x] Bonus: Implemented "Legal Bundle Discovery" export

### 3. Final Polish
[Goal: Production readiness]
- [x] Run full end-to-end test (Create Title -> Admin Add Domain -> Scout Scan -> Review -> Action)
- [x] Verify Stripe Subscription limits (Indie vs Rights Manager) are enforced at the DB level

---

## Phase 5: Visual Design & UI Auditing
**Goal**: Elevate the visual quality to a premium SaaS standard using the Sentinel Design System.

### 1. Theme Implementation
[Goal: Establish the visual foundation]
- [x] Implement Sentinel Blue & Gunmetal theme variables in `globals.css`
- [ ] Align Tailwind config with new semantic variables
- [ ] Audit generic text color usage across all components

### 2. High-Fidelity UI Polish
[Goal: Professional grade interface]
- [ ] Redesign `TitleDetailsClient` with improved hierarchy and visual data displays
- [ ] Update `TakedownListClient` with cleaner table layouts and status badges
- [ ] Create detailed "Wireframe 2.0" document reflecting the polished state
- [ ] Enhance "Empty States" and loading skeletons for better UX
