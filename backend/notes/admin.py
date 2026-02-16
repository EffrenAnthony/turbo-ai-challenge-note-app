from django.contrib import admin

from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "category", "created_at", "updated_at"]
    list_filter = ["category", "created_at"]
    search_fields = ["title", "content", "user__email"]
    ordering = ["-created_at"]
    readonly_fields = ["created_at", "updated_at"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "category")
