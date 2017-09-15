
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Project

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('name', 'desc', 'owner')
    verbose_name_plural = 'Project'

admin.site.register(Project, ProjectsAdmin)