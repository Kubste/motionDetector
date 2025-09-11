from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from auth_manager.models import User

class TensorFlowModel(models.Model):
    model_name = models.CharField(max_length=32)
    model_version = models.CharField(max_length=16)
    model_url = models.URLField()

    def __str__(self):
        return self.model_name

class Camera(models.Model):
    camera_name = models.CharField(max_length=32)
    board_name = models.CharField(max_length=32)
    location =models.CharField(max_length=64)
    address = models.GenericIPAddressField(protocol='IPv4', unique=True)
    process_image = models.BooleanField(default=True)
    confidence_threshold = models.FloatField(default=0.1, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    model = models.ForeignKey(TensorFlowModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.camera_name

class Storage(models.Model):
    path = models.CharField(max_length=128)
    checksum = models.CharField(max_length=128)

    def __str__(self):
        return f"Storage: {self.path}"

class TensorFlowOutput(models.Model):
    confidence = models.FloatField()
    person_count = models.IntegerField()

    def __str__(self):
        return f"Output: {self.confidence}"

class ImageInfo(models.Model):
    filename = models.CharField(max_length=128)
    file_size = models.BigIntegerField()
    file_type = models.CharField(max_length=16)
    resolution = models.CharField(max_length=16)
    timestamp = models.DateTimeField()
    is_processed = models.BooleanField(default=False)
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='images')
    storage = models.OneToOneField(Storage, on_delete=models.CASCADE)
    output = models.OneToOneField(TensorFlowOutput, on_delete=models.CASCADE, null=True, blank=True)
    model = models.ForeignKey(TensorFlowModel, on_delete=models.CASCADE, null=True, blank=True)

    def delete(self, *args, **kwargs):
        if self.output:
            self.output.delete()
        if self.storage:
            self.storage.delete()

        super().delete(*args, **kwargs)

    def __str__(self):
        return self.filename