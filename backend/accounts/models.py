from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    def __str__(self):
        return self.email
