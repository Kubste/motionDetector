from django.urls import path
from .views import upload_image, change_camera_resolution

app_name = 'cameraManager'

urlpatterns = [
    path('upload/', upload_image, name='upload'),
    path('change-resolution/', change_camera_resolution, name='change_resolution'),
]