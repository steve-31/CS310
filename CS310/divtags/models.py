# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=30)
    desc = models.CharField(max_length=300)
    owner = models.ForeignKey(User, related_name='owner')
    contributors = models.ManyToManyField(User, related_name='contributers')
    lastedited = models.DateTimeField(default=timezone.now)
    ispublished = models.BooleanField(default=False)