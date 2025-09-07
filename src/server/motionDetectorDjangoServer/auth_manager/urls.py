from django.urls import path
from knox import views as knox_views
from .views import LoginView, RegisterView, PasswordChangeView, LogoutOutAllUsers

app_name = 'auth_manager'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),               # pre-made view - logging out user session
    path('logout-all/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),     # pre-made view - logging out user for all his sessions
    path('logout-all-users/', LogoutOutAllUsers.as_view(), name='logout_all_users'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password-change/', PasswordChangeView.as_view(), name='password_change'),
]