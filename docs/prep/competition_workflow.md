# 🚀 High-Efficiency ADK Agent Workflow for SentinelAI

## 📋 Architecture Overview
This document outlines the **streamlined, job-based agent architecture** for SentinelAI. Unlike the complex "Research Agent" (User Chat -> Planning -> Research -> Report), SentinelAI agents are **headless workers** triggered by database events or API calls.

### **Core Agent Methodology**
- **Headless & Async**: Agents do not chat. They receive a `job_payload` and return a `job_result`.
- **Single Responsibility**: One agent does ONE thing perfectly (Scout scans, Action executes).
- **Tool-First Design**: LLMs are primarily used as "Routers" and "Graders," while the heavy lifting is done by deterministic tools (Crawlers, DMCA Generators).

---

## 🏗️ Agent Hierarchy & Configuration

### **1. Scout Agent (The Hunter)**
**Purpose**: Crawl specific domains to detect pirated content for a given Title/ISBN.
- **Trigger**: `POST /api/webhooks/scan-job` -> ADK `run`
- **Input Payload**:
  ```json
  {
    "scan_id": "scan_123",
    "title": "Project Hail Mary",
    "author": "Andy Weir",
    "target_domain": "pirate-books.com"
  }
  ```
- **Tools**:
  - `web_crawler_tool`: Fetches HTML content from target URL.
  - `piracy_grader_tool`: Analyzes text for keywords ("Download PDF", "Free Epub", "Magnet Link").
- **Output**:
  - `detected_links`: List of found URLs with `piracy_grade` ("Critical", "Suspicious", "Safe").

### **2. Action Agent (The Enforcer)**
**Purpose**: Execute takedown notices or shadow-drop payloads for approved findings.
- **Trigger**: `POST /api/webhooks/action-job` -> ADK `run`
- **Input Payload**:
  ```json
  {
    "action_id": "act_456",
    "target_url": "https://pirate-books.com/download/123",
    "action_type": "DMCA_NOTICE" | "SHADOW_DROP",
    "admin_email": "legal@publisher.com"
  }
  ```
- **Tools**:
  - `dmca_generator`: Fills legal template with target details.
  - `email_sender`: Sends the DMCA notice to the abuse contact.
  - `shadow_dropper`: (Phase 2) Deploys a decoy file to the target if possible.
- **Output**:
  - `status_update`: "SENT", "FAILED", "DEPLOYED".

---

## 🔗 Agent Connection Mapping

```
Next.js Server Actions (Job Dispatcher)
│
├──> [Job Queue / DB] status="pending"
│
└──> ADK Service (Python)
    ├── Scout Agent (Router)
    │   ├── Crawler Tool
    │   └── Grader Tool
    │
    └── Action Agent (Router)
        ├── DMCA Generator
        └── Email/API Tool
```

---

## 📊 Data Models (Pydantic / Agent State)

### **Scout Result Schema**
```python
class DetectedLink(BaseModel):
    url: str
    piracy_grade: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW", "Clean"]
    evidence_snippet: str  # "Found 'Download PDF' button"
    screenshot_url: Optional[str]

class ScanResult(BaseModel):
    scan_id: str
    status: Literal["COMPLETED", "FAILED"]
    links_found: List[DetectedLink]
```

---

## 🔧 Implementation Strategy

### **Phase 1: Mocked Agents (Mechanism Test)**
Because building a perfect crawler is complex, **Phase 1** agents will be "Mocked" to validate the architecture.
- **Scout Agent** will receive a URL and *pretend* to scan it, returning hardcoded "Pirate Link" results after a delay.
- **Goal**: Ensure the Next.js Dashboard -> Database -> Agent -> Webhook -> UI Update loop works perfectly.

### **Phase 2: Real Tools**
Once the loop is closed, we replace the `MockTools` with real implementation logic (`BeautifulSoup`, `Selenium`, etc.).

---

## 📋 Build Order (Revised for SentinelAI)

1. **Scout Agent Foundation**: `apps/scout-agent/agents/scout.py`
2. **Crawler Tool**: `apps/scout-agent/tools/crawler.py` (Start with Mock)
3. **Webhook Listener**: `apps/web/app/api/webhooks/scan-result/route.ts`
4. **Action Agent Foundation**: `apps/scout-agent/agents/action.py`
5. **DMCA Tool**: `apps/scout-agent/tools/dmca.py`

---
