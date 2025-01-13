from pymongo import MongoClient
from django.db import models

client = MongoClient('mongodb://localhost:27017/finance_app')
db = client.finance_app

class Transaction(models.Model):
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=255)

    def __str__(self):
        return self.title