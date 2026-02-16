Analyze the project files (or the file I'm currently working on) and apply the following Python and Django REST Framework best practices. Identify violations, suggest improvements, and refactor the code where necessary.

---

## General Python

- Follow PEP 8: 4-space indentation, snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants.
- Use type hints on function signatures. Prefer `str`, `int`, `list[str]` over `typing.List[str]` (Python 3.10+).
- Prefer f-strings over `.format()` or `%` string formatting.
- Keep functions short and focused on a single responsibility. If a function exceeds ~30 lines, consider splitting it.
- Use early returns to reduce nesting. Avoid deep if/else chains.
- Import order: stdlib → third-party → local. Use isort grouping. Prefer absolute imports.
- Don't use mutable default arguments (`def func(items=[])`). Use `None` and assign inside.
- Use `pathlib.Path` over `os.path` for file path manipulation.
- Use context managers (`with`) for file operations and database connections.

## Django Models

- Every model should have a `__str__` method that returns a human-readable representation.
- Use `class Meta` to define `ordering`, `db_table`, `verbose_name_plural` where appropriate.
- Use `auto_now_add=True` for creation timestamps, `auto_now=True` for update timestamps.
- Use `related_name` on ForeignKey and ManyToManyField for reverse access clarity.
- Use `on_delete=models.CASCADE` thoughtfully. Consider `PROTECT` or `SET_NULL` when deletion should not cascade.
- Keep business logic out of models. Models define data structure; views and services handle logic.
- Use `select_related()` for ForeignKey joins and `prefetch_related()` for ManyToMany to avoid N+1 queries.

## Django REST Framework Serializers

- Use `ModelSerializer` when the serializer maps directly to a model. Use `Serializer` for custom request/response shapes.
- Mark fields as `read_only=True` or `write_only=True` explicitly. Don't leak internal fields (password, is_staff) in responses.
- Use `validate_<field>()` for single-field validation and `validate()` for cross-field validation.
- For nested relationships:
  - Use a read-only nested serializer for responses (full object).
  - Use `PrimaryKeyRelatedField` with `write_only=True` for input (just the ID).
- Don't put business logic in serializers. Keep `create()` and `update()` focused on object creation/mutation.
- Avoid `SerializerMethodField` when the data can be achieved with a proper queryset annotation or nested serializer.

## Django REST Framework Views

- Use the most specific generic view or viewset that fits the use case:
  - `ListAPIView` for read-only lists
  - `CreateAPIView` for create-only
  - `RetrieveUpdateDestroyAPIView` for single-object CRUD
  - `ModelViewSet` for full CRUD
- Set `permission_classes` explicitly on every view. Don't rely solely on `DEFAULT_PERMISSION_CLASSES`.
- Use `get_queryset()` instead of `queryset` attribute when the queryset depends on the request (e.g., filtering by user).
- Use `perform_create()` / `perform_update()` to inject extra data (like `user=request.user`), not by overriding `create()`.
- Use `select_related` / `prefetch_related` in `get_queryset()` to optimize database queries.
- Restrict `http_method_names` when not all CRUD operations should be available.
- For custom actions, use `@action` decorator instead of creating separate views.

## Permissions

- Create custom permission classes for object-level authorization (e.g., `IsOwner`).
- Keep permission classes small and focused. One class per authorization rule.
- Use `has_permission()` for request-level checks and `has_object_permission()` for object-level checks.
- Combine permissions with lists: `permission_classes = [IsAuthenticated, IsOwner]`.

## URL Configuration

- Use `include()` to delegate URL routing to each app's `urls.py`.
- Use DRF `DefaultRouter` for ViewSets. Use `path()` for individual views.
- Set `app_name` in each app's `urls.py` for proper namespacing.
- Keep URL patterns RESTful: use nouns (not verbs), use trailing slashes consistently.

## Testing

- Use `APIClient` from DRF for endpoint tests, not Django's default `Client`.
- Test both success and failure cases for every endpoint.
- Test authentication and permission requirements (unauthenticated access returns 401, unauthorized returns 403/404).
- Use `setUp()` to create test data. Don't share state between tests.
- Test edge cases: missing fields, invalid data, duplicate entries, nonexistent IDs.
- For JWT-protected endpoints, generate tokens in `setUp()` and set credentials with `client.credentials()`.
- Name test methods descriptively: `test_cannot_delete_other_users_note` over `test_delete_fail`.
- Test model `__str__`, ordering, and constraints.

## Error Handling

- Use DRF's `raise_exception=True` on `serializer.is_valid()` instead of manually checking and returning errors.
- Return proper HTTP status codes: 201 for created, 204 for deleted, 400 for validation errors, 401 for unauthenticated, 403 for forbidden, 404 for not found.
- Use `{"detail": "message"}` format for general errors. Use `{"field": ["message"]}` for field-level validation errors.
- Don't catch broad `Exception`. Catch specific exceptions (`TokenError`, `ObjectDoesNotExist`, etc.).

## Security

- Never hardcode `SECRET_KEY` in production. Use environment variables.
- Set `DEBUG = False` in production.
- Validate and sanitize all user input through serializers before saving.
- Use Django's built-in password validators for registration.
- Configure CORS to only allow known frontend origins.
- Use HTTPS in production. Set `SECURE_SSL_REDIRECT = True`.

## Project Structure

```
backend/
  app_name/
    models.py        → Data models
    serializers.py   → Request/response serialization
    views.py         → API views and viewsets
    urls.py          → URL routing for the app
    permissions.py   → Custom permission classes (if needed)
    admin.py         → Django admin configuration
    tests.py         → Unit tests
    managers.py      → Custom model managers (if needed)
    backends.py      → Custom auth backends (if needed)
  project_name/
    settings.py      → All configuration
    urls.py          → Root URL routing
```

---

Review the indicated files or the current file applying these practices. For each finding:
1. Point to the line or section with the issue.
2. Briefly explain why it violates the practice.
3. Apply the fix directly in the code.
