# Notes App — Backend

REST API for a notes application built with Django 6 and Django REST Framework, featuring JWT authentication with token rotation.

## Tech Stack

- **Django 6.0.2** — Web framework
- **Django REST Framework 3.16.1** — REST API toolkit
- **SimpleJWT** — JWT authentication with access/refresh token rotation and blacklisting
- **django-cors-headers** — CORS support for frontend communication
- **django-filter** — Queryset filtering
- **drf-spectacular** — OpenAPI 3.0 / Swagger documentation
- **SQLite3** — Development database

## Getting Started

### Prerequisites

- Python 3.12+
- pip

### Installation

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional, for admin panel)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The server runs at `http://localhost:8000`.

### Environment

The frontend (Next.js) expects the API at `http://localhost:8000/api`. CORS is configured to allow requests from `http://localhost:3000`.

## API Documentation

Interactive API documentation is available when the server is running:

| URL | Description |
|---|---|
| `/api/docs/` | Swagger UI — interactive endpoint testing |
| `/api/redoc/` | ReDoc — clean, readable documentation |
| `/api/schema/` | Raw OpenAPI 3.0 schema (YAML) |

### Authentication Flow

1. **Register** or **Login** to get an access + refresh token pair
2. Send the access token in the `Authorization: Bearer <token>` header
3. When the access token expires (15 min), use the **refresh endpoint** to get a new pair
4. On refresh, the old refresh token is blacklisted and a new one is issued (rotation)
5. Refresh tokens expire after 7 days of inactivity

### API Endpoints

#### Auth (public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login with email and password |
| POST | `/api/auth/token/refresh/` | Refresh access token (rotates refresh token) |

#### Auth (protected)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/logout/` | Blacklist refresh token |

#### Notes (protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes/` | List user's notes (paginated) |
| POST | `/api/notes/` | Create a note |
| GET | `/api/notes/:id/` | Get a note by ID |
| PATCH | `/api/notes/:id/` | Partially update a note |
| DELETE | `/api/notes/:id/` | Delete a note |

#### Categories (protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories/` | List all categories |

## Project Structure

```
backend/
├── turbo_back/            # Django project configuration
│   ├── settings.py        # All settings (DRF, JWT, CORS, apps)
│   └── urls.py            # Root URL routing + API docs
├── accounts/              # Authentication & user management
│   ├── models.py          # Custom User model (email-based)
│   ├── managers.py        # Custom user manager
│   ├── backends.py        # Email authentication backend
│   ├── serializers.py     # Auth serializers + OpenAPI response schemas
│   ├── views.py           # Register, Login, TokenRefresh, Logout
│   └── tests.py           # 25 tests
├── categories/            # Note categories
│   ├── models.py          # Category model
│   ├── serializers.py     # Category serializer
│   ├── views.py           # List categories (no pagination)
│   └── tests.py           # 7 tests
├── notes/                 # Notes CRUD
│   ├── models.py          # Note model (FK to Category + User)
│   ├── permissions.py     # IsOwner permission class
│   ├── serializers.py     # Note serializer (nested category)
│   ├── views.py           # NoteViewSet (ModelViewSet)
│   └── tests.py           # 20 tests
├── manage.py
├── requirements.txt
└── db.sqlite3
```

## Testing

```bash
# Run all tests
python manage.py test

# Run tests for a specific app
python manage.py test accounts
python manage.py test notes
python manage.py test categories

# Run a single test class
python manage.py test notes.tests.NotePermissionTest

# Run a single test method
python manage.py test notes.tests.NotePermissionTest.test_cannot_delete_other_users_note

# Run with coverage
pip install coverage
coverage run --source=accounts,categories,notes manage.py test
coverage report -m
```

**Current coverage: 99% across 52 tests.**

### What's Being Tested

#### Accounts (25 tests)

- **User Manager** — User and superuser creation, email normalization, validations (empty email, incorrect flags)
- **User Model** — `__str__` and `USERNAME_FIELD`
- **Register** — Successful registration with tokens, password mismatch, duplicate email, weak password, missing fields
- **Login** — Successful login, wrong password, nonexistent user, missing fields
- **Token Refresh** — Successful refresh with rotation, invalid token, missing token, blacklisted token reuse
- **Logout** — Successful logout, unauthenticated access (401), missing refresh token, invalid token

#### Notes (20 tests)

- **Note Model** — `__str__`, descending date ordering
- **List** — Returns only the authenticated user's notes, pagination, unauthenticated access (401), nested category in response
- **Create** — Successful creation, automatic user assignment, validations (missing title, missing category, invalid category)
- **Detail** — Retrieve own note, nonexistent note (404)
- **Update** — Patch title, patch category, PUT not allowed (405)
- **Delete** — Delete own note
- **Permissions** — Cannot view, update, or delete another user's notes (404)

#### Categories (7 tests)

- **Category Model** — `__str__`, unique name constraint, alphabetical ordering
- **List** — Successful listing, all fields present, no pagination (flat list), unauthenticated access (401)

## Architecture Decisions

### Custom User Model

The default Django user model uses `username` for authentication. This project uses a custom `User` model with `email` as the `USERNAME_FIELD`, matching the frontend's auth flow. A custom `EmailBackend` handles `authenticate()` calls using email lookup.

### JWT Token Rotation

SimpleJWT is configured with `ROTATE_REFRESH_TOKENS=True` and `BLACKLIST_AFTER_ROTATION=True`. When a client refreshes their token, the old refresh token is blacklisted (can't be reused) and a completely new access + refresh pair is issued. This allows indefinite session persistence while mitigating token theft.

### Note Ownership Isolation

Notes are isolated per user through two mechanisms:
- **QuerySet filtering** — `get_queryset()` filters by `user=request.user`, so users never see other users' notes in list views
- **Object-level permissions** — `IsOwner` permission class blocks detail/update/delete on notes owned by other users

### Nested Category Serialization

The `NoteSerializer` uses a dual-field pattern:
- `category` (read-only) — Returns the full nested category object in responses
- `category_id` (write-only) — Accepts just the category ID in create/update requests

---

## AI-Assisted Development

This backend was built using [Claude Code](https://claude.ai/code) (Anthropic's CLI agent for software development). The AI assisted with:

- **Architecture design** — Planned the app structure, models, serializers, views, and URL routing based on the frontend's API contract
- **Code generation** — Generated all Django apps, models, serializers, views, permissions, and admin configuration
- **JWT implementation** — Configured SimpleJWT with token rotation, blacklisting, and custom refresh logic
- **API documentation** — Set up drf-spectacular with OpenAPI annotations on all endpoints
- **Test suite** — Created 52 unit tests achieving 99% code coverage across all apps
- **Code review** — Used the `/python_best_practices` Claude command (see below) to validate code quality

### Claude Commands

This project includes a custom Claude Code command for Python code review:

```
/python_best_practices
```

Run this command in Claude Code to analyze Python files in the project and get suggestions based on Django/DRF best practices. The command checks for proper serializer usage, view patterns, model design, test coverage, and general Python conventions.

The command file is located at `.claude/commands/python_best_practices.md`.
