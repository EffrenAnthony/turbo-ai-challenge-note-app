from django.conf import settings
from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.ForeignKey(
        "categories.Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notes",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notes"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
