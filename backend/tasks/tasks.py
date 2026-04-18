from celery import shared_task
from .models import Task
from django.utils import timezone

@shared_task
def check_overdue_tasks():
    now = timezone.now()
    # Bulk update overdue status to solve the N+1 query problem
    Task.objects.filter(completed=False, deadline__lt=now).update(is_overdue=True)
    Task.objects.filter(completed=False, deadline__gte=now).update(is_overdue=False)