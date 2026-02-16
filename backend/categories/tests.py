from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category

User = get_user_model()


class CategoryModelTest(TestCase):
    def test_str(self):
        category = Category.objects.create(name="Work")
        self.assertEqual(str(category), "Work")

    def test_unique_name(self):
        Category.objects.create(name="Work")
        with self.assertRaises(Exception):
            Category.objects.create(name="Work")

    def test_ordering(self):
        Category.objects.create(name="Zebra")
        Category.objects.create(name="Alpha")
        categories = list(Category.objects.values_list("name", flat=True))
        self.assertEqual(categories, ["Alpha", "Zebra"])


class CategoryListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/categories/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        Category.objects.create(name="Work")
        Category.objects.create(name="Personal")

    def test_list_categories(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_returns_all_fields(self):
        response = self.client.get(self.url)
        category = response.data[0]
        self.assertIn("id", category)
        self.assertIn("name", category)
        self.assertIn("created_at", category)
        self.assertIn("updated_at", category)

    def test_list_no_pagination(self):
        response = self.client.get(self.url)
        # Should be a list, not a paginated object
        self.assertIsInstance(response.data, list)

    def test_list_unauthenticated(self):
        self.client.credentials()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
