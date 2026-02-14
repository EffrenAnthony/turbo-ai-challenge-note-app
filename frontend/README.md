# Notes App - Frontend

A full-featured notes application built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS
- **Jest + React Testing Library** - Testing
- **ESLint + Prettier** - Linting and formatting
- **Husky + lint-staged** - Git hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

This frontend connects to a Django REST Framework backend. Make sure the backend is running at the URL specified in `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api`).

## Scripts

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start dev server (Turbopack) |
| `npm run build`         | Production build             |
| `npm run start`         | Start production server      |
| `npm run lint`          | Run ESLint                   |
| `npm run lint:fix`      | Run ESLint with auto-fix     |
| `npm run format`        | Format with Prettier         |
| `npm run format:check`  | Check formatting             |
| `npm run test`          | Run tests                    |
| `npm run test:watch`    | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage      |

## Project Structure

```
src/
  app/                    # Next.js App Router
    (auth)/               # Auth pages (login, register)
    (dashboard)/          # Protected pages (notes CRUD)
  components/
    ui/                   # Reusable UI (Button, Input, Card, Modal, Select, Spinner, Badge)
    forms/                # Form components (LoginForm, RegisterForm, NoteForm)
    layout/               # Layout components (Header, Sidebar, Footer)
    notes/                # Note components (NoteCard, NoteDetail, NoteList, CategoryFilter)
    providers/            # Context providers (AuthProvider, Providers)
  lib/
    api/                  # HTTP client and API service functions
    hooks/                # Custom React hooks (useAuth, useNotes, useCategories)
    utils/                # Utilities (cn, dates, validation, constants)
    auth/                 # Token management
  types/                  # TypeScript interfaces
  __tests__/              # Test files mirroring src/ structure
  middleware.ts           # Route protection
```

## Environment Variables

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL     | `http://localhost:3000`     |
