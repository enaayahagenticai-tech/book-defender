## Strategic Database Planning Document

### App Summary
**End Goal:** Help publishers and authors achieve automated detection and removal of book piracy to protect revenue.
**Template Used:** adk-agent-saas (Heavily modified schema)
**Core Features:** Title Asset Management, Automated Scanning Logs, Takedown Review Queue, Shadow-Drop Counter-measures, Global Admin Domain List.

---

## 🗄️ Current Database State

### Existing Tables (adk-agent-saas Template)
- **`users`** - User accounts. **KEEPING.** (Will modify).
- **`session_names`** - Chat session titles. **DEPRECATED/IGNORE.** (Refers to chatbot logic).
- **`usage_events`** - Message counts. **DEPRECATED/IGNORE.** (Refers to LLM tokens).

### Template Assessment  
**❌ Poor Fit:** The template provides a Chatbot schema, but SentinelAI is an Asset Protection platform.
**🔧 Ready to Build:** Only the `users` (Auth/Stripe) foundation produces value. The rest must be built from scratch to support the "Search & Destroy" workflow.

---

## ⚡ Feature-to-Schema Mapping

### Core Features (New Core Tables)
- **Asset Management** → New `titles` table.
- **Scanning Logic** → New `active_scans` table (Job logs).
- **Takedown Workflow** → New `detected_links` table (The Work Queue).
- **Global Intelligence** → New `pirate_domains` table (Admin Master List).
- **User Allowlist** → New `allowed_domains` table.

---

## 📋 Recommended Changes

**Bottom Line:** You need to **Create 5 new tables** and **Modify 1 existing table**.

### Decision #1: Modify `users` Table
- **Problem:** Need to track "Indie" vs "Rights Manager" limits.
- **Action:** Add `plan_tier` enum (`'free', 'indie', 'rights_manager'`).
- **Action:** Add `active_titles_count` (int) for fast limit enforcement.

### Decision #2: Create `titles` Table
- **Fields:**
  - `id` (uuid, pk)
  - `user_id` (fk -> users.id)
  - `title` (text)
  - `author` (text)
  - `isbn` (text, unique per user)
  - `cover_image_url` (text)
  - `status` (enum: `'active', 'paused'`)
  - `last_scan_at` (timestamp, nullable)

### Decision #3: Create `detected_links` Table (The Work Queue)
- **Fields:**
  - `id` (uuid, pk)
  - `title_id` (fk -> titles.id)
  - `domain_id` (fk -> pirate_domains.id, nullable)
  - `url` (text, not null)
  - `piracy_grade` (enum: `'critical', 'high', 'medium', 'low'`) - **Risk Score**
  - `status` (enum: `'pending', 'approved_takedown', 'shadow_dropped', 'ignored'`) - **Workflow State**
  - `screenshot_url` (text, evidence)
  - `shadow_drop_payload` (text, nullable) - **Counter-Measure Log**
  - `takedown_sent_at` (timestamp, nullable)

### Decision #4: Create `pirate_domains` Table (Admin Master List)
- **Fields:**
  - `id` (uuid, pk)
  - `domain` (text, unique, e.g. "libgen.is")
  - `risk_level` (enum: `'critical', 'high', 'medium', 'low'`)
  - `is_active` (boolean, default true)

### Decision #5: Create `active_scans` Table (System Logs)
- **Fields:**
  - `id` (uuid, pk)
  - `title_id` (fk -> titles.id)
  - `started_at` (timestamp)
  - `completed_at` (timestamp, nullable)
  - `links_found_count` (int, default 0)
  - `status` (enum: `'running', 'completed', 'failed'`)

---

## 🎯 Strategic Advantage

By decoupling from the "Chat" schema, we gain:
1. **Performance:** `detected_links` queries will be fast and specific to the Takedown Queue, not mixed with chat logs.
2. **Clarity:** "Titles" and "Scans" map 1:1 to the user's mental model.
3. **Scalability:** The `pirate_domains` master list allows the Admin to tune the global brain of the system without touching user data.

**Next Steps:** Generate these new Drizzle schema files in `lib/drizzle/schema/`.

> **Development Approach:** Ignore `session_names.ts`. Build `titles.ts` first, then `pirate_domains.ts`, then `detected_links.ts`. This dependency order ensures Foreign Keys work correctly.
