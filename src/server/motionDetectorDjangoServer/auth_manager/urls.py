from django.contrib.auth.views import PasswordResetView
from django.urls import include, path
from knox import views as knox_views
from rest_framework.routers import DefaultRouter
from .views import send_code, reset_password

from .views import LoginView, RegisterView, PasswordChangeView, LogoutOutAllUsers, AuthManagerView, UsersView

app_name = 'auth_manager'

router = DefaultRouter()
router.register(r'auth-manager', AuthManagerView, basename='auth-manager')
router.register(r'users', UsersView, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),               # pre-made view - logging out user session
    path('logout-all/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),     # pre-made view - logging out user for all his sessions
    path('logout-all-users/', LogoutOutAllUsers.as_view(), name='logout_all_users'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password-change/', PasswordChangeView.as_view(), name='password_change'),
    path('send-code/', send_code, name='send_code'),
    path('reset-password/', reset_password, name='password_reset'),
]