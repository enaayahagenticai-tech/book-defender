# Book Defender (SentinelAI)

A high-security, mobile-first surveillance platform for digital rights protection and threat management.

## Project Structure (Archon-Optimized)

```text
book-defender/
├── docs/                # Persistent project knowledge (Architecture, API, Rules)
├── frontend/            # React Native / Expo application
├── backend/             # Supabase schema and database configurations
├── workflows/           # Deterministic development workflows
├── tests/               # Automated verification and test scripts
└── README.md            # Project entry point
```

## Getting Started

### 1. Environment Setup
Copy `.env.example` (found in root or `frontend/`) to `.env.local` and fill in your Supabase and Gemini credentials.

### 2. Frontend Development
```bash
cd frontend
npm install
npx expo start
```

### 3. Backend Management
The database is managed via Supabase. Refer to `docs/database-schema.md` for the current table structure.

## Development Workflow
This project follows the **Archon Workflow**:
1. **Plan**: Create an implementation plan in `docs/`.
2. **Implement**: Backend first, then Frontend.
3. **Verify**: Run tests in `tests/`.
4. **Document**: Update relevant files in `docs/`.

Refer to `workflows/feature-development.yml` for detailed steps.

## Documentation
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Coding Rules](docs/coding-rules.md)
- [UI Guidelines](docs/ui-rules.md)
- [Roadmap](docs/roadmap.md)
