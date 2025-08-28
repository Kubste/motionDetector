from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *

app_name = 'api'

router = DefaultRouter()
router.register(r'cameras', CameraViewSet, basename='cameras')
router.register(r'image-info', ImageInfoViewSet, basename='image-info')
router.register(r'tensor-flow-models', TensorFlowModelViewSet, basename='tensor-flow-models')
router.register(r'tensor-flow-outputs', TensorFlowOutputViewSet, basename='tensor-flow-outputs')
router.register(r'storage', StorageViewSet, basename='storage')

urlpatterns = [
    path('', include(router.urls)),
]