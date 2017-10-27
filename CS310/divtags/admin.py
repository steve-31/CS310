
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Project, ProjectObject, ProjectAttribute, ProjectAttributeType

# Define an inline admin descriptor for Employee model
# which acts a bit like a singleton
class ProjectsAdmin(admin.ModelAdmin):
    list_display = ('name', 'desc', 'owner',)
    verbose_name_plural = 'Project'

admin.site.register(Project, ProjectsAdmin)

class ProjectObjectsAdmin(admin.ModelAdmin):
    list_display = ('project', 'name', 'desc',)
    verbose_name_plural = 'Project Object'

admin.site.register(ProjectObject, ProjectObjectsAdmin)

class ProjectObjectAttributesAdmin(admin.ModelAdmin):
    list_display = ('name', 'type',)
    verbose_name_plural = 'Project Object Attribute'

admin.site.register(ProjectAttribute, ProjectObjectAttributesAdmin)

class ProjectObjectAttributeTypesAdmin(admin.ModelAdmin):
    list_display = ('name',)
    verbose_name_plural = 'Project Object Attribute Type'

admin.site.register(ProjectAttributeType, ProjectObjectAttributeTypesAdmin)