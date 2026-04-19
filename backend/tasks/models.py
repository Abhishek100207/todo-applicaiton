import os
from django.db import models
from django.utils import timezone

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_overdue(self):
        if not self.deadline:
            return False
        return self.deadline < timezone.now() and not self.completed

    def __str__(self):
        return self.title