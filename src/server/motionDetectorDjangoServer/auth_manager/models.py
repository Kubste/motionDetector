from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

class User(AbstractUser):

    # fields required for superuser
    REQUIRED_FIELDS = ['phone_number', 'email', 'role', 'first_name', 'last_name']

    ROLE_CHOICES = [
        ('sup', 'Superuser'),
        ('admin', 'Administrator'),
        ('user', 'User'),
    ]

    # validates phone number - \d -> digit
    phone_validator = RegexValidator(r'^\d{9,11}$', 'Enter an 9 to 11 digit phone number')
    phone_number = models.CharField(max_length=11, unique=True, validators=[phone_validator])
    role = models.CharField(max_length=8, choices=ROLE_CHOICES, default='user')

    def set_user_password(self, password):
        self.set_password(password)
        self.save(update_fields=['password'])

    def __str__(self):
        return self.username