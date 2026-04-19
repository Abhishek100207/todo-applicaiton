from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'deadline', 'completed', 'created_at', 'is_overdue']

    def get_is_overdue(self, obj):
        return obj.is_overdue