from django.db import models
from auth_manager.models import User

class Camera(models.Model):
    cameraName = models.CharField(max_length=32)
    boardName = models.CharField(max_length=32)
    location =models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.cameraName

class ImageInfo(models.Model):
    filename = models.CharField(max_length=128)
    fileSize = models.BigIntegerField()
    fileType = models.CharField(max_length=16)
    resolution = models.CharField(max_length=16)
    timestamp = models.DateTimeField()
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, related_name='images')

    def __str__(self):
        return self.filename

class TensorFlowModel(models.Model):
    modelName = models.CharField(max_length=16)
    modelVersion = models.CharField(max_length=16)

    def __str__(self):
        return self.modelName

class TensorFlowOutput(models.Model):
    confidence = models.FloatField()
    personCount = models.IntegerField()
    isProcessed = models.BooleanField()
    imageInfo = models.ForeignKey(ImageInfo, on_delete=models.CASCADE, related_name='allInfo')
    tensorFlowModel = models.ForeignKey(TensorFlowModel, on_delete=models.CASCADE, related_name='models')

    def __str__(self):
        return f"Output: {self.imageInfo.filename}"

class Storage(models.Model):
    path = models.CharField(max_length=128)
    checksum = models.CharField(max_length=128)
    imageInfo = models.OneToOneField(ImageInfo, on_delete=models.CASCADE)

    def __str__(self):
        return f"Storage: {self.imageInfo.filename}"