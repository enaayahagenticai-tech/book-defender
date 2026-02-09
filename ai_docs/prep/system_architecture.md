## System Architecture Blueprint

### App Summary
**End Goal:** Help publishers and authors achieve automated detection and removal of book piracy.
**Template Foundation:** **adk-agent-saas** (Supabase + Python Agent Engine + Next.js).
**Required Extensions:** "Scout Agent" (Crawler), "Action Agent" (Executor), Counter-Measure Tools.

---

## 🏗️ System Architecture

### Template Foundation
**Your Chosen Template:** `adk-agent-saas`
**Built-in Capabilities:**
- **Supabase:** Auth, PostgreSQL Database, Blob Storage.
- **Google Agent Engine:** Hosting for Python ADK agents.
- **Next.js:** Web Application framework.

### Architecture Diagram

```mermaid
graph TD
    %% Styling Classes
    classDef userInterface fill:#1E88E5,stroke:#1565C0,stroke-width:2px,color:#fff
    classDef frontend fill:#42A5F5,stroke:#1976D2,stroke-width:2px,color:#fff
    classDef backend fill:#66BB6A,stroke:#388E3C,stroke-width:2px,color:#fff
    classDef database fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    classDef adkAgent fill:#9C27B0,stroke:#6A1B9A,stroke-width:3px,color:#fff
    classDef external fill:#FF7043,stroke:#D84315,stroke-width:2px,color:#fff

    subgraph "User Interface Layer"
        UserBrowser[User Browser <br> Dashboard / Takedowns]:::userInterface
        AdminBrowser[Admin Browser <br> Domain Master List]:::userInterface
    end

    subgraph "Application Layer - Template Foundation"
        NextApp[Next.js App <br> (Vercel)]:::frontend
        API[API Routes <br> /api/webhooks]:::backend
    end

    subgraph "ADK Agent Server - Piracy Hunter System"
        RootAgent[Root Coordinator <br> (LlmAgent)]:::adkAgent
        
        subgraph "Scout Pipeline"
            ScoutAgent[Scout Agent <br> (LlmAgent + Tools)]:::adkAgent
            Crawler[Web Crawler Tool]:::backend
            Vision[Vision AI <br> (Captcha/Screenshots)]:::backend
        end

        subgraph "Action Pipeline"
            ActionAgent[Action Agent <br> (LlmAgent)]:::adkAgent
            DMCAGen[DMCA Generator]:::backend
            ShadowDrop[Shadow-Drop Deployer]:::backend
        end
        
        SessionService[InMemorySessionService]:::backend
    end

    subgraph "Data Layer - Sentinel Database"
        SupabaseDB[(Supabase PostgreSQL)]:::database
        SupabaseStorage[Supabase Storage <br> (Screenshots/Decoys)]:::database
    end

    subgraph "External Services"
        Stripe[Stripe <br> Payments]:::external
        PirateSites[Target Pirate Sites]:::external
        GoogleSearch[Google Search API]:::external
    end

    %% Connections
    UserBrowser -->|HTTPS| NextApp
    AdminBrowser -->|HTTPS| NextApp
    
    NextApp -->|Server Actions| SupabaseDB
    NextApp -.->|Trigger Scan/Action| RootAgent
    
    RootAgent -->|Delegates| ScoutAgent
    RootAgent -->|Delegates| ActionAgent
    
    ScoutAgent -->|Crawls| PirateSites
    ScoutAgent -->|Search| GoogleSearch
    ScoutAgent -->|Saves Evidence| SupabaseStorage
    ScoutAgent -->|Logs Links| SupabaseDB
    
    ActionAgent -->|Sends DMCA| PirateSites
    ActionAgent -->|Deploys Decoy| PirateSites
    ActionAgent -->|Updates Status| SupabaseDB

    Stripe -->|Webhooks| API
```

### Extension Strategy
**Why These Extensions:**
- **Scout Agent:** Repurposes the ADK agent from "Chatting" to "Patrolling" (crawling/vision).
- **Action Agent:** Centralizes the "Kill Chain" logic (DMCA/Shadow-Drop) in a secure backend environment.
- **Trigger Pattern:** Decouples the UI from the long-running agent tasks.

### System Flow Explanation
**Command Center (Next.js):** Users manage Assets (Titles) and Review Takedowns. Actions trigger jobs in the ADK Server.
**Hunter System (ADK):** Scheduled jobs wake up the Scout Agent to scan targets from the `pirate_domains` list.
**Data Flow:** All "Intelligence" (links, screenshots) flows from ADK -> Supabase. All "Directives" (approve, scan now) flow from Next.js -> ADK.

---

## ⚠️ Technical Risk Assessment

### ✅ Template Foundation Strengths (Low Risk)
- **Unified Infrastructure:** Supabase handling DB, Auth, and Storage dramatically reduces complexity.
- **Next.js Server Actions:** Secure, simple way to manage the Command Center logic.

### ⚠️ Extension Integration Points (Monitor These)
- **Agent Latency:** Crawling is slow. **Mitigation:** Asynchronous jobs + Status Polling.
- **Bot Detection:** Pirate sites will block crawlers. **Mitigation:** Proxies (Phase 2), Vision AI, Slow Crawl Rates.
- **False Positives:** Legitimate sites getting flagged. **Mitigation:** Strict `allowed_domains` lists.

### 🟢 Smart Architecture Decisions
- **Async "Patrol" Model:** Moving away from synchronous "Chat" prevents UI timeouts.
- **Separation of Concerns:** "Management" vs "Hunting" logic is clearly separated, allowing independent scaling.

---

## 🏗️ Implementation Strategy

### Phase 1 (Leverage Template Foundation)
- Establish the `titles`, `pirate_domains`, and `detected_links` database schema.
- Build the Next.js Dashboard and Takedown Review UI.

### Phase 2 (Add Required Extensions)  
- Implement the "Scout Agent" with basic crawling capabilities.
- Implement the "Action Agent" with DMCA generation and basic Shadow-Drop logic.

### Integration Guidelines
- Use **Next.js Server Actions** to trigger ADK Agent jobs (via API).
- Use **Supabase Realtime** or Polling to update the UI when Agents find new links.
