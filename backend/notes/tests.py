from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from categories.models import Category

from .models import Note

User = get_user_model()


class NoteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")

    def test_str(self):
        note = Note.objects.create(
            title="My Note", content="Content", category=self.category, user=self.user
        )
        self.assertEqual(str(note), "My Note")

    def test_ordering(self):
        note1 = Note.objects.create(
            title="First", content="Content", category=self.category, user=self.user
        )
        note2 = Note.objects.create(
            title="Second", content="Content", category=self.category, user=self.user
        )
        notes = list(Note.objects.values_list("title", flat=True))
        self.assertEqual(notes, ["Second", "First"])  # Newest first


class NoteListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/notes/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.other_user = User.objects.create_user(email="other@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        self.note = Note.objects.create(
            title="My Note", content="Content", category=self.category, user=self.user
        )
        Note.objects.create(
            title="Other Note", content="Content", category=self.category, user=self.other_user
        )

    def test_list_returns_only_own_notes(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "My Note")

    def test_list_is_paginated(self):
        response = self.client.get(self.url)
        self.assertIn("count", response.data)
        self.assertIn("next", response.data)
        self.assertIn("previous", response.data)
        self.assertIn("results", response.data)

    def test_list_unauthenticated(self):
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_note_has_nested_category(self):
        response = self.client.get(self.url)
        note = response.data["results"][0]
        self.assertIsInstance(note["category"], dict)
        self.assertEqual(note["category"]["name"], "Work")


class NoteCreateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/notes/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_create_note(self):
        data = {"title": "New Note", "content": "Some content", "category_id": self.category.id}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Note")
        self.assertEqual(response.data["category"]["id"], self.category.id)

    def test_create_note_assigns_current_user(self):
        data = {"title": "New Note", "content": "Some content", "category_id": self.category.id}
        self.client.post(self.url, data, format="json")
        note = Note.objects.get(title="New Note")
        self.assertEqual(note.user, self.user)

    def test_create_note_missing_title(self):
        data = {"content": "Some content", "category_id": self.category.id}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_note_missing_category(self):
        data = {"title": "New Note", "content": "Some content"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_note_invalid_category(self):
        data = {"title": "New Note", "content": "Content", "category_id": 9999}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class NoteDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        self.note = Note.objects.create(
            title="My Note", content="Content", category=self.category, user=self.user
        )

    def test_retrieve_own_note(self):
        response = self.client.get(f"/api/notes/{self.note.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "My Note")
        self.assertIn("category", response.data)
        self.assertIn("created_at", response.data)

    def test_retrieve_nonexistent_note(self):
        response = self.client.get("/api/notes/9999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class NoteUpdateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        self.category2 = Category.objects.create(name="Personal")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        self.note = Note.objects.create(
            title="My Note", content="Content", category=self.category, user=self.user
        )

    def test_partial_update_title(self):
        response = self.client.patch(
            f"/api/notes/{self.note.id}/", {"title": "Updated"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated")
        self.assertEqual(response.data["content"], "Content")  # Unchanged

    def test_partial_update_category(self):
        response = self.client.patch(
            f"/api/notes/{self.note.id}/",
            {"category_id": self.category2.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["category"]["id"], self.category2.id)

    def test_put_not_allowed(self):
        response = self.client.put(
            f"/api/notes/{self.note.id}/",
            {"title": "Updated", "content": "New", "category_id": self.category.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class NoteDeleteViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        self.note = Note.objects.create(
            title="My Note", content="Content", category=self.category, user=self.user
        )

    def test_delete_own_note(self):
        response = self.client.delete(f"/api/notes/{self.note.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=self.note.id).exists())


class NotePermissionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.other_user = User.objects.create_user(email="other@test.com", password="TestPass123!")
        self.category = Category.objects.create(name="Work")
        self.note = Note.objects.create(
            title="Other's Note", content="Content", category=self.category, user=self.other_user
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_cannot_retrieve_other_users_note(self):
        response = self.client.get(f"/api/notes/{self.note.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_update_other_users_note(self):
        response = self.client.patch(
            f"/api/notes/{self.note.id}/", {"title": "Hacked"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_delete_other_users_note(self):
        response = self.client.delete(f"/api/notes/{self.note.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
