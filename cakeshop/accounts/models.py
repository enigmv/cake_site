from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=2, default='CU')
    is_email_verified = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.user.username} {self.user.email} ({self.role})"