from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import AbstractBaseUser
from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    AuthResponseSerializer,
    LoginSerializer,
    LogoutRequestSerializer,
    RegisterSerializer,
    TokenRefreshRequestSerializer,
    TokenRefreshResponseSerializer,
    UserSerializer,
)


User = get_user_model()


def _get_tokens_for_user(user: AbstractBaseUser) -> dict[str, str]:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@extend_schema(tags=["Auth"])
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(
        summary="Register user",
        description="Creates a new user and returns user data along with JWT tokens.",
        responses={201: AuthResponseSerializer},
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": _get_tokens_for_user(user),
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=["Auth"])
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        summary="Login",
        description="Authenticates the user with email and password. Returns user data and JWT tokens.",
        responses={200: AuthResponseSerializer},
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": _get_tokens_for_user(user),
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(tags=["Auth"])
class TokenRefreshView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = TokenRefreshRequestSerializer

    @extend_schema(
        summary="Refresh token",
        description="Receives a refresh token, invalidates it and returns a new access/refresh pair (rotation).",
        responses={200: TokenRefreshResponseSerializer},
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            old_token = RefreshToken(refresh_token)
            old_token.blacklist()

            user = User.objects.get(id=old_token["user_id"])
            new_refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "access": str(new_refresh.access_token),
                    "refresh": str(new_refresh),
                },
                status=status.HTTP_200_OK,
            )
        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


@extend_schema(tags=["Auth"])
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutRequestSerializer

    @extend_schema(
        summary="Logout",
        description="Blacklists the refresh token. Requires Bearer token in the header.",
        responses={204: None},
    )
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TokenError:
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
