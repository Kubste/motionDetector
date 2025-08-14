from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    phoneNumber = models.CharField(max_length=11, unique=True)

    def set_user_password(self, password):
        self.set_password(password)
        self.save(update_fields=['password'])

    def __str__(self):
        return self.username