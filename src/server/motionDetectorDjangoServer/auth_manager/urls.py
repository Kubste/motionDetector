from django.urls import path
from knox import views as knox_views
from .views import LoginView, RegisterView, PasswordChangeView
from .permissions import IsAdmin

app_name = 'auth_manager'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),   # pre-made view
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),  # pre-made view
    path('register/', RegisterView.as_view(), name='register'),
    path('password-change/', PasswordChangeView.as_view(), name='password_change'),
]