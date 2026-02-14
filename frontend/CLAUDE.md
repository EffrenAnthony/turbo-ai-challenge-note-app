# CLAUDE.md - Notes App Frontend

## Project Overview

Notes App frontend built with Next.js 15, TypeScript, and Tailwind CSS. Backend is Django REST Framework (separate project).

## Commands

```bash
npm run dev            # Start dev server with Turbopack
npm run build          # Production build
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run format         # Format all files with Prettier
npm run format:check   # Check formatting
npm run test           # Run Jest tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Architecture

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Prettier
- **Git hooks:** Husky + lint-staged

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
    (auth)/         # Auth route group (login, register)
    (dashboard)/    # Protected route group (notes CRUD)
  components/
    ui/             # Reusable UI components (Button, Input, Card, etc.)
    forms/          # Form components (LoginForm, RegisterForm, NoteForm)
    layout/         # Layout components (Header, Sidebar, Footer)
    notes/          # Note-specific components (NoteCard, NoteList, etc.)
    providers/      # Context providers (AuthProvider, Providers)
  lib/
    api/            # HTTP client and API functions
    hooks/          # Custom React hooks
    utils/          # Utility functions (cn, dates, validation, constants)
    auth/           # Token management
  types/            # TypeScript interfaces
  __tests__/        # Tests mirroring src/ structure
  middleware.ts     # Route protection middleware
```

## Conventions

- **Components:** PascalCase, named exports (pages use default export)
- **Hooks:** camelCase with `use` prefix
- **Types:** PascalCase interfaces, no `I` prefix
- **Imports:** Always use `@/` alias
- **Server/Client:** Server Components by default, `'use client'` only when needed
- **Tests:** Located in `src/__tests__/` mirroring the `src/` structure
- **Formatting:** No semicolons, single quotes, trailing commas, 100 char width

## API Contract

Backend base URL: `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api`)

### Endpoints

- `POST /auth/login/` - Login
- `POST /auth/register/` - Register
- `POST /auth/token/refresh/` - Refresh token
- `POST /auth/logout/` - Logout
- `GET /notes/` - List notes (paginated)
- `POST /notes/` - Create note
- `GET /notes/:id/` - Get note
- `PATCH /notes/:id/` - Update note
- `DELETE /notes/:id/` - Delete note
- `GET /categories/` - List categories
