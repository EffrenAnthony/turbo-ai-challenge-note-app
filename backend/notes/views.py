from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets

from .models import Note
from .permissions import IsOwner
from .serializers import NoteSerializer


@extend_schema_view(
    list=extend_schema(summary="List notes", description="Returns the authenticated user's notes (paginated)."),
    create=extend_schema(summary="Create note", description="Creates a new note for the authenticated user."),
    retrieve=extend_schema(summary="Get note", description="Returns a note by ID (only if owned by the user)."),
    partial_update=extend_schema(summary="Update note", description="Partially updates a note (PATCH)."),
    destroy=extend_schema(summary="Delete note", description="Deletes a note by ID."),
)
@extend_schema(tags=["Notes"])
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).select_related("category")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
