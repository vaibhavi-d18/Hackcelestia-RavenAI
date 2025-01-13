from django.urls import path
from rest_framework import routers
from .views import TransactionView

router = routers.DefaultRouter()
router.register(r'transactions', TransactionView, basename='transactions')

urlpatterns = [
    path('', include(router.urls)),
]