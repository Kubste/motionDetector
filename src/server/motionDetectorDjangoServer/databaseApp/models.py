from django.db import models
from auth_manager.models import User

class Camera(models.Model):
    camera_name = models.CharField(max_length=32)
    board_name = models.CharField(max_length=32)
    location =models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.GenericIPAddressField(protocol='IPv4', unique=True)

    def __str__(self):
        return self.camera_name

class ImageInfo(models.Model):
    filename = models.CharField(max_length=128)
    file_size = models.BigIntegerField()
    file_type = models.CharField(max_length=16)
    resolution = models.CharField(max_length=16)
    timestamp = models.DateTimeField()
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='cameras')

    def __str__(self):
        return self.filename

class TensorFlowModel(models.Model):
    model_name = models.CharField(max_length=16)
    model_version = models.CharField(max_length=16)

    def __str__(self):
        return self.model_name

class TensorFlowOutput(models.Model):
    confidence = models.FloatField()
    person_count = models.IntegerField()
    is_processed = models.BooleanField()
    image_info = models.ForeignKey(ImageInfo, on_delete=models.CASCADE, related_name='allInfo')
    tensorFlow_model = models.ForeignKey(TensorFlowModel, on_delete=models.CASCADE, related_name='models')

    def __str__(self):
        return f"Output: {self.image_info.filename}"

class Storage(models.Model):
    path = models.CharField(max_length=128)
    checksum = models.CharField(max_length=128)
    image_info = models.OneToOneField(ImageInfo, on_delete=models.CASCADE)

    def __str__(self):
        return f"Storage: {self.image_info.filename}"