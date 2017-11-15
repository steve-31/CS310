# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=30)
    desc = models.CharField(max_length=300)
    owner = models.ForeignKey(User, related_name='owner')
    contributors = models.ManyToManyField(User, related_name='contributers')
    lastedited = models.DateTimeField(default=timezone.now)
    ispublished = models.BooleanField(default=False)
    file = JSONField()
    
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

class ProjectVersion(models.Model):
    project = models.ForeignKey(Project)
    datetime = models.DateTimeField()
    versionno = models.IntegerField()
    iterationno = models.IntegerField()
    file = JSONField()
    