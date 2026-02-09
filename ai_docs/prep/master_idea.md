## Master Idea Document

### End Goal
My app helps **publishers and authors** achieve **automated detection and removal of book piracy to protect revenue** using **autonomous web scanning and automated DMCA evidence collection**.

### Specific Problem
Publishers and authors are stuck because **finding and removing pirated copies is a manual, endless game of whack-a-mole**, leading to **significant revenue loss (often estimated at 15-30% of sales) and brand dilution as illegal copies flood the market**.

### All User Types
#### Primary Users: Independent Authors
- **Who:** Self-published authors or small press owners controlling their own rights
- **Frustrations:**
    - Spending writing time searching Google for stolen PDFs
    - Don't know how to file valid DMCA takedowns effectively
    - Emotional toll of seeing their work stolen
- **Urgent Goals:**
    - "Set and forget" piracy protection
    - Valid legal takedowns sent automatically

#### Secondary Users: Rights Managers (Publisher Legal/Rights Teams)
- **Who:** Rights managers at mid-sized publishing houses
- **Frustrations:**
    - Managing takedowns for hundreds of titles manually
    - No centralized dashboard to track enforcement success
    - Slow response times allow leaks to spread
- **Urgent Goals:**
    - Bulk protection for entire catalogs
    - Reporting dashboard to prove ROI to executives

#### System Administrators: Platform Ops
- **Who:** SentinelAI internal admins
- **Frustrations:**
    - False positives flagging legitimate promo copies
    - Scraper bots getting blocked by pirate sites
- **Urgent Goals:**
    - Monitor scan health and success rates
    - Accurate detection tuning
    - **Manage the global list of piracy domains to guide the AI agents**

### Business Model & Revenue Strategy
- **Model Type:** Title-Based Subscription Tiers
- **Pricing Structure:** 
  - **Free Trial:** 1 free scan/takedown trial to prove efficacy
  - **Indie Author Tier ($19/mo):** Protect up to 5 titles
  - **Rights Manager Tier ($99/mo):** Protect up to 20 titles + bulk reporting
  - **Enterprise/Catalog:** Custom pricing for entire backlists (50+ titles)
- **Revenue Rationale:** Piracy is an ongoing threat; protection needs to be continuous. Subscription aligns incentives better than pay-per-takedown (prevention vs. reaction).

### Core Functionalities by Role (MVP)
- **Indie Author (Standard User)**
  - Add/Edit book details (Title, Author, ISBN/ASIN) for protection slots (up to 5)
  - Activate/Pause autonomous daily scanning for specific titles
  - Review discovered links and approve DMCA takedown notices (Manual approval for MVP)
  - View simple status dashboard (Links Found, Takedowns Sent, Success Rate)
  - Manage "Allowlist" of authorized vendor domains
  - Receive Tiered Alerts (Immediate for High-Risk, Daily Summary for others)

- **Rights Manager (Power User)**
  - Add titles manually (up to 20)
  - Access aggregate reporting dashboard showing piracy trends across all managed titles
  - Manage "Allowlist" of authorized vendor domains to prevent false positives
  - Receive Tiered Alerts (Immediate for High-Risk, Daily Summary for others)

- **System Administrator (Internal)**
  - Manage the "Master Piracy Domain List" (add/block/prioritize known pirate sites)
  - Monitor global agent health and success rates of DMCA submissions
  - Manually intervene on flagged or failed takedown requests

### Key User Stories
#### Indie Author Stories
1. **Title Onboarding**
   *As an* Indie Author,
   *I want* to easily add my book's Title, Author Name, and cover image,
   *So that* the AI knows exactly what intellectual property to protect.

2. **Takedown Review**
   *As an* Indie Author,
   *I want* to see a list of potential piracy links found by the scanner,
   *So that* I can verify they are actually pirated copies before a DMCA is sent.

3. **Whitelisting**
   *As an* Indie Author,
   *I want* to add specific domains to an allowlist,
   *So that* the scanner doesn't accidentally flag legitimate copies.

4. **Tiered Alert System**
   *As an* Indie Author,
   *I want* to receive immediate email notifications for High-Risk threats and a daily summary for lower-risk activity,
   *So that* I can take action promptly without checking the dashboard 24/7.

#### Rights Manager Stories
5. **Portfolio Overview**
   *As a* Rights Manager,
   *I want* a dashboard showing the protection status of all 20 titles at once,
   *So that* I can quickly identify which books are currently being targeted by pirates.

6. **Whitelisting**
   *As a* Rights Manager,
   *I want* to add specific domains (like my own shop or review sites) to an allowlist,
   *So that* the scanner doesn't accidentally flag legitimate promotional copies.

7. **Tiered Alert System**
   *As a* Rights Manager,
   *I want* to receive immediate email notifications for High-Risk threats and a daily summary for lower-risk activity,
   *So that* I can take action promptly without checking the dashboard 24/7.

#### System/Background Stories
8. **Scheduled Scanning Job**
   *As the* System,
   *I want* to run a scheduled search job for every active title against the Master Piracy Domain List daily,
   *So that* new piracy links are detected within 24 hours of appearing.

9. **Agent Evidence Collection**
   *As the* Search Agent,
   *I want* to capture screenshots and timestamps of detected piracy pages,
   *So that* we have undeniable proof preserved for the legal takedown notice.

10. **Admin Domain Management**
    *As a* System Administrator,
    *I want* to manage the master list of piracy domains,
    *So that* the AI agents have an up-to-date target list for their scans.

### Value-Adding Features (Advanced)
- **Takedown Success Analytics (MVP):** Visual charts showing "Time to Removal" per pirate domain to prove ROI.
- **Dynamic "Piracy Grade" Scoring (MVP):** Flag detected sites with a confidence score (Critical/High/Medium/Low) to help users prioritize manual approvals.
- **Automated "Shadow-Drop" Counter-Intelligence (MVP):** Flood sites with decoy files to dilute illegal content alongside takedown efforts.
- **Honey Pot Link Tracking (Future):** Create traceable decoy copies to track source of leaks.
- **SEO Displacement Tips (Future):** Advice on how to rank legitimate links higher.
