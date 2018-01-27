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
    currversionno = models.IntegerField()
    curriterationno = models.IntegerField()
    currexperimentalno = models.IntegerField(null=True)
    pubversionno = models.IntegerField(null=True)
    pubiterationno = models.IntegerField(null=True)
    pubdate = models.DateTimeField(null=True)
    file = JSONField()
    logo = models.ImageField(upload_to="img/ProjectLogos", null=True)
    
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

class ProjectVersionExperimental(models.Model):
    #parent = models.ForeignKey(ProjectVersion)
    experimentalno = models.IntegerField()
    datetime = models.DateTimeField()
    file = JSONField()

class ProjectVersion(models.Model):
    project = models.ForeignKey(Project)
    datetime = models.DateTimeField()
    versionno = models.IntegerField()
    iterationno = models.IntegerField()
    experimentals = models.ManyToManyField(ProjectVersionExperimental)
    file = JSONField()
    
