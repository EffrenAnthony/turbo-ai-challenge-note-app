from typing import Any

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.http import HttpRequest

User = get_user_model()


class EmailBackend(ModelBackend):
    def authenticate(
        self,
        request: HttpRequest | None,
        email: str | None = None,
        password: str | None = None,
        **kwargs: Any,
    ) -> Any:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None
