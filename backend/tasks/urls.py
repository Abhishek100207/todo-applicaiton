from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, SuggestDescriptionView, EnhanceDescriptionView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('suggest/', SuggestDescriptionView.as_view(), name='suggest_description'),
    path('enhance/', EnhanceDescriptionView.as_view(), name='enhance_description'),
]
