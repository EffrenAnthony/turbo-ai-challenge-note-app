from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions

from .models import Category
from .serializers import CategorySerializer


@extend_schema(tags=["Categories"])
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    @extend_schema(
        summary="List categories",
        description="Returns all available categories (no pagination).",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
