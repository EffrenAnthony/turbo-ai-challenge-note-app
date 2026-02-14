# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Django REST Framework backend for a Notes application. Part of a monorepo — the frontend is a Next.js app in `../frontend/`. The backend is currently in an initial state: only the Django project shell (`turbo_back`) exists with no apps, models, or API endpoints implemented yet.

## Commands

```bash
# Activate virtual environment (required before all commands)
source venv/bin/activate

# Run development server
python manage.py runserver              # Default: http://localhost:8000

# Database
python manage.py makemigrations         # Generate migration files
python manage.py migrate                # Apply migrations
python manage.py createsuperuser        # Create admin user

# Tests
python manage.py test                   # Run all tests
python manage.py test app_name          # Run tests for a specific app
python manage.py test app_name.tests.TestClassName  # Run a single test class
python manage.py test app_name.tests.TestClassName.test_method  # Run a single test

# Django shell
python manage.py shell                  # Interactive Python shell with Django context
```

## Architecture

- **Framework:** Django 6.0.2 with Django REST Framework 3.16.1
- **Database:** SQLite3 (development)
- **Project name:** `turbo_back`
- **Additional packages:** django-filter, Markdown, sqlparse

### Current State

The backend has only the base project scaffolding. No Django apps, models, serializers, views, or custom URL routes exist yet. REST Framework is installed in `INSTALLED_APPS` but not configured.

### Expected API Contract (defined by frontend)

The frontend at `../frontend/` expects these endpoints under `/api`:

- `POST /api/auth/login/` — Login (returns tokens)
- `POST /api/auth/register/` — Register new user
- `POST /api/auth/token/refresh/` — Refresh JWT token
- `POST /api/auth/logout/` — Logout
- `GET /api/notes/` — List notes (paginated)
- `POST /api/notes/` — Create note
- `GET /api/notes/:id/` — Get single note
- `PATCH /api/notes/:id/` — Update note
- `DELETE /api/notes/:id/` — Delete note
- `GET /api/categories/` — List categories

### Packages Not Yet Installed But Likely Needed

- `django-cors-headers` — CORS support (frontend runs on `localhost:3000`)
- `djangorestframework-simplejwt` — JWT authentication (frontend uses token-based auth with access/refresh tokens)

## Conventions

- Settings file: `turbo_back/settings.py`
- URL config root: `turbo_back/urls.py`
- Working directory for all `manage.py` commands: `backend/`
- Virtual environment is at `backend/venv/`
