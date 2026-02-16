from rest_framework import serializers

from categories.models import Category
from categories.serializers import CategorySerializer

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "content",
            "category",
            "category_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
