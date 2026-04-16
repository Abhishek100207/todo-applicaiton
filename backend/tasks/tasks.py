from celery import shared_task
from .models import Task
from django.utils import timezone

@shared_task
def check_overdue_tasks():
    now = timezone.now()
    tasks = Task.objects.filter(completed=False)

    for task in tasks:
        if task.deadline < now:
            task.is_overdue = True
        else:
            task.is_overdue = False
        task.save()