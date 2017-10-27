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
    
class ProjectFile(models.Model):
    name = models.CharField(max_length=40)
    url = models.FileField()
    
class ProjectAttributeType(models.Model):
    name = models.CharField(max_length=50)
    
class ProjectAttribute(models.Model):
    name = models.CharField(max_length=50)
    type = models.ForeignKey(ProjectAttributeType)
    
class ProjectObject(models.Model):
    project = models.ForeignKey(Project)
    name = models.CharField(max_length=50)
    desc = models.CharField(max_length=150)
    attributes = models.ManyToManyField(ProjectAttribute)
    