from django.contrib import admin
from .models import ImageInfo, Camera, TensorFlowOutput, TensorFlowModel, Storage

# Register your models here.
admin.site.register(ImageInfo)
admin.site.register(Camera)
admin.site.register(TensorFlowOutput)
admin.site.register(TensorFlowModel)
admin.site.register(Storage)
