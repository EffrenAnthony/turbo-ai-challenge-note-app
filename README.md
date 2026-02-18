# Notes App

A full-stack notes application with JWT authentication, category management, and voice dictation. Built with Django REST Framework and Next.js.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Django 6, Django REST Framework, SimpleJWT, SQLite |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| State Management | TanStack React Query, Formik, React Context |
| HTTP Client | Axios with interceptors |
| Testing | Django TestCase (52 tests), Jest + React Testing Library (103 tests) |

## Project Structure

```
turbo-ai-challenge/
├── backend/          # Django REST API
│   ├── accounts/     # Custom user model, JWT auth (register, login, refresh, logout)
│   ├── categories/   # Note categories
│   ├── notes/        # Notes CRUD with ownership isolation
│   └── turbo_back/   # Django project settings
├── frontend/         # Next.js application
│   ├── src/app/      # Pages and API route proxies
│   ├── src/components/ # UI atoms, forms, icons, layout, notes
│   ├── src/lib/      # API client, hooks, utilities, auth
│   └── src/types/    # TypeScript interfaces
└── .claude/commands/ # Claude Code custom commands
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The backend runs at `http://localhost:8000`, the frontend at `http://localhost:3000`.

For detailed setup instructions, see the individual READMEs:
- [Backend README](backend/README.md) — Django setup, API endpoints, architecture decisions
- [Frontend README](frontend/README.md) — Next.js setup, component documentation, design system

## Database

The project uses **SQLite** for development simplicity. Thanks to Django's ORM, switching to **PostgreSQL** or **MySQL** requires only changing the `DATABASES` setting in `settings.py` — no code changes needed. All models, queries, and migrations are database-agnostic.

---

## Process Summary

### Backend First

Development started with the backend to establish a solid API contract before building the frontend.

1. **Models** — Designed the data layer first: a custom `User` model with email-based authentication (replacing Django's default username), a `Category` model, and a `Note` model with foreign keys to both User and Category.

2. **Serializers** — Built DRF serializers with a dual-field pattern for related objects (e.g., `category` for nested read responses, `category_id` for write operations). Registration and login serializers handle password hashing, validation, and token generation.

3. **Views** — Implemented the API endpoints: `RegisterView`, `LoginView`, custom `TokenRefreshView` with rotation, `LogoutView` with token blacklisting, `CategoryListView`, and a full `NoteViewSet` (list, create, retrieve, update, delete).

4. **Authentication & Authorization** — Configured SimpleJWT with token rotation and blacklisting. Access tokens expire in 15 minutes, refresh tokens in 7 days. On refresh, the old token is blacklisted and a new pair is issued. Notes are isolated per user through queryset filtering and an `IsOwner` permission class.

5. **Testing** — 52 unit tests covering all models, serializers, views, and edge cases (99% coverage).

### Frontend Second

With the API contract established, the frontend was built following an Atomic Design methodology.

1. **Theme & Design System** — Defined four custom color palettes (sunset, honey, sage, jade) and two fonts (Inter for body, Inria Serif for titles) using Tailwind CSS v4's `@theme` directive.

2. **Infrastructure** — Set up Axios with a queue-based token refresh interceptor, React Query for server state, and an AuthProvider for session management. Created Next.js API routes to proxy all backend calls, adding a security layer that keeps the real backend URL server-side.

3. **Atoms** — Built foundational UI components: Button (outline style with color variants), Input (with password toggle), Card (themed container), Spinner (accessible loading indicator).

4. **Molecules & Pages** — Composed atoms into forms (LoginForm, RegisterForm with Formik validation), note components (NoteCard with smart dates, NoteList with empty state), the note editor (NoteForm with autosave, category dropdown, voice dictation), and the dashboard layout (Sidebar with category filtering).

5. **Refactoring** — Extracted responsibilities from the NoteForm (CategoryDropdown, DictationButton, useAutosave hook), migrated all forms to Formik, and moved all inline SVGs to a dedicated icons folder.

6. **Testing** — 103 unit tests covering UI components, forms, layout, icons, and utility functions.

---

## Key Design & Technical Decisions

### Architecture

- **API route proxy layer** — All frontend API calls go through Next.js API routes (`/api/auth/login`, `/api/notes`, etc.) which forward requests to the Django backend using Axios. This keeps the real backend URL (`localhost:8000`) hidden from the browser, adding a security layer and making it easy to change the backend URL without affecting the client.

- **JWT with token rotation and blacklisting** — Instead of simple token expiration, the backend rotates refresh tokens on every refresh call and blacklists the old one. This means a stolen refresh token can only be used once. The frontend stores tokens in both localStorage (for Axios interceptors) and cookies (for Next.js middleware route protection).

- **Queue-based token refresh** — When multiple API calls fail with 401 simultaneously, the Axios interceptor queues them and only makes one refresh call. After the token is refreshed, all queued requests are replayed with the new token. This prevents race conditions and redundant refresh calls.

- **SQLite for development** — SQLite was chosen for zero-configuration setup. Django's ORM ensures all queries are database-agnostic, so migrating to PostgreSQL or MySQL for production is a configuration change only.

### Frontend Design

- **Atomic Design** — Components are organized in layers (atoms → molecules → pages), making the codebase scalable and each piece independently testable. The design system is built on four theme colors with consistent usage across cards, buttons, and category indicators.

- **Mobile-first / Responsive** — The layout adapts from mobile to desktop: the sidebar is hidden on mobile and replaced by inline category chips, the notes grid scales from 1 to 4 columns.

- **Axios over fetch** — Axios was chosen for its interceptor system (critical for transparent token refresh), automatic JSON parsing, and cleaner error handling. Every client-side HTTP request goes through a single configured instance.

- **React Query for server state** — All data fetching uses TanStack React Query instead of `useEffect` + `useState`. This provides automatic caching, background refetching, loading/error states, and cache invalidation after mutations — eliminating an entire class of bugs related to stale data and race conditions.

- **Formik for forms** — All forms (login, register, note editor) use Formik for consistent form state management, validation, and dirty tracking. The note editor uses Formik's `enableReinitialize` with a custom `useAutosave` hook that debounces changes and auto-saves to the backend.

- **Next.js API routes as proxy** — Backend endpoints are never called directly from the browser. Next.js API routes act as a proxy layer, forwarding requests with Axios. This hides the backend origin, simplifies CORS configuration, and provides a single point of control for request/response transformation.

---

## AI Tools Used

This project was developed using **[Claude Code](https://claude.ai/code)** (Anthropic's CLI agent) as a copilot. All architectural decisions, design direction, coding standards, best practices, and bug fixes were driven by the developer — Claude Code served as a productivity multiplier for code generation, standardization, and iterative implementation.

### How Claude Code Was Used

**Productivity & Code Generation** — Claude Code accelerated development by generating boilerplate and implementation code based on the developer's specifications. The workflow was iterative: the developer defined the requirements and architecture, Claude Code generated the code, and the developer reviewed, corrected, and refined the output.

**Standardization via Custom Commands** — Three custom Claude Code commands were created by the developer to enforce the project's coding standards consistently:

| Command | Purpose |
| --- | --- |
| `/python_best_practices` | Analyzes Python files and applies Django/DRF best practices (serializer patterns, view structure, model design, test coverage) |
| `/react_best_practices` | Enforces React/Next.js conventions (component structure, hook rules, TypeScript patterns, performance) |
| `/project_frontend_rules` | Project-specific rules: zero warnings, one component per file, Axios for all requests, React Query for all server state, Formik for forms, loading/error handling patterns, and a 18-point checklist before finishing any change |

These commands codify the developer's standards so they are applied automatically on every change, ensuring consistency across the codebase.

**Testing & Refactoring** — Claude Code assisted in generating the test suites (52 backend tests, 103 frontend tests) and in executing refactors like extracting components from NoteForm, always under the developer's direction and review.

The custom commands (stored in `.claude/commands/`) are version-controlled with the project, so any developer using Claude Code on this codebase gets the same standards enforced automatically.

---

## Testing

| Layer | Framework | Tests | Coverage |
| --- | --- | --- | --- |
| Backend | Django TestCase | 52 | 99% |
| Frontend | Jest + React Testing Library | 103 | Components + utilities |

```bash
# Backend tests
cd backend && python manage.py test

# Frontend tests
cd frontend && npm run test
```

See the individual READMEs for detailed test documentation:
- [Backend testing details](backend/README.md#testing)
- [Frontend testing details](frontend/README.md#phase-8-unit-testing)
