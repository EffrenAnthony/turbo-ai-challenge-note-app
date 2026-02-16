from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserManagerTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.assertEqual(user.email, "user@test.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password("TestPass123!"))

    def test_create_user_normalizes_email(self):
        user = User.objects.create_user(email="user@TEST.COM", password="TestPass123!")
        self.assertEqual(user.email, "user@test.com")

    def test_create_user_without_email_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="TestPass123!")

    def test_create_superuser(self):
        user = User.objects.create_superuser(email="admin@test.com", password="TestPass123!")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_superuser_not_staff_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(email="admin@test.com", password="TestPass123!", is_staff=False)

    def test_create_superuser_not_superuser_raises(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(email="admin@test.com", password="TestPass123!", is_superuser=False)


class UserModelTest(TestCase):
    def test_str(self):
        user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.assertEqual(str(user), "user@test.com")

    def test_username_field(self):
        self.assertEqual(User.USERNAME_FIELD, "email")


class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/register/"

    def test_register_success(self):
        data = {
            "email": "new@test.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["email"], "new@test.com")
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])
        self.assertTrue(User.objects.filter(email="new@test.com").exists())

    def test_register_password_mismatch(self):
        data = {
            "email": "new@test.com",
            "password": "StrongPass123!",
            "password_confirm": "Different123!",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email(self):
        User.objects.create_user(email="existing@test.com", password="TestPass123!")
        data = {
            "email": "existing@test.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_weak_password(self):
        data = {
            "email": "new@test.com",
            "password": "123",
            "password_confirm": "123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_fields(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/login/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")

    def test_login_success(self):
        data = {"email": "user@test.com", "password": "TestPass123!"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["email"], "user@test.com")

    def test_login_wrong_password(self):
        data = {"email": "user@test.com", "password": "WrongPass123!"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_login_nonexistent_user(self):
        data = {"email": "nobody@test.com", "password": "TestPass123!"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/token/refresh/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.refresh = RefreshToken.for_user(self.user)

    def test_refresh_success(self):
        data = {"refresh": str(self.refresh)}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        # New refresh should be different (rotation)
        self.assertNotEqual(response.data["refresh"], str(self.refresh))

    def test_refresh_invalid_token(self):
        data = {"refresh": "invalid-token"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_missing_token(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_blacklisted_token(self):
        data = {"refresh": str(self.refresh)}
        # First refresh succeeds
        self.client.post(self.url, data, format="json")
        # Second refresh with same token fails (blacklisted)
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/auth/logout/"
        self.user = User.objects.create_user(email="user@test.com", password="TestPass123!")
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_logout_success(self):
        data = {"refresh": str(self.refresh)}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logout_unauthenticated(self):
        self.client.credentials()  # Remove auth
        data = {"refresh": str(self.refresh)}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_missing_refresh(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_invalid_token(self):
        data = {"refresh": "invalid-token"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
