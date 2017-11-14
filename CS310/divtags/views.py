# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.db.models import Q
from itertools import chain
from operator import attrgetter
import os
import json
from django.core.serializers import serialize

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Project, ProjectObject, ProjectAttributeType
from .forms import SignUpForm, NewProjectForm
from django.contrib.auth.decorators import login_required

# Create your views here.

def index(request):
    
    context = {
        "title": "Home",
    }
    
    if request.method == "POST":
        postusername = request.POST.get('username')
        postpassword = request.POST.get('password')
        user = authenticate(username=postusername, password=postpassword)
        if user is not None:
            # A backend authenticated the credentials
            login(request, user)
            return redirect('divtags:home')
        else:
            # No backend authenticated the credentials
            return redirect('login')
    
    return render(request, 'divtags/index.html', context)

def register(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('divtags:home')
    else:
        form = SignUpForm()
    
    context = {
        "title": "Register",
        "form": form,
    }
    
    return render(request, 'divtags/register.html', context)

def examples(request):
    
    context = {
        "title": "Examples",
    }
    
    return render(request, 'divtags/examples.html', context)

def myprojectlist(request):
    
    context = {
        "title": "My Projects",
    }
    
    return render(request, 'divtags/myprojects.html', context)

@login_required
def project(request, pid):
    
    current_user = request.user
    
    try:
        projecttest = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
        projecttest = projecttest.get(pk=pid)
    except Project.DoesNotExist:
        return redirect('permissiondenied')
    
    project = Project.objects.get(pk=pid)
    users = User.objects.all().order_by('username')
    projectdir = ""
    projectobj = ProjectObject.objects.filter(project = pid)
    attribute_types = ProjectAttributeType.objects.all().order_by('name')
    message = ""
    
    
    
    context = {
        "error_message": message,
        "title": "Project",
        "project": project,
        "users": users,
        "projectdir": projectdir,
        "objects": projectobj,
        "attribute_types": attribute_types,
    }
    
    return render(request, 'divtags/project.html', context)

@login_required
def project_save(request, pid):
    current_user = request.user
    
    try:
        projecttest = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
        projecttest = projecttest.get(pk=pid)
    except Project.DoesNotExist:
        return redirect('permissiondenied')
    project = Project.objects.get(pk=pid)
    if request.method == "POST":
        json_file = request.POST.get('file')
        json_file = json.loads(json_file)
        print(json_file)
        project.file = json_file
        project.save()
        return JsonResponse({'message': json_file})
    else:
        return render(request, 'divtags/project.html', {})

def changeprojectowner(request, pid):
    owner = request.GET.get('owner-select')
    project = Project.objects.filter(pk=pid)
    project.owner_id = owner
    project.save()

def newproject(request):
    
    
    if request.method == 'POST':
        form = NewProjectForm(request.POST)
        if form.is_valid():
            form.save(commit=False)
            form.owner = request.user
            form.lastedited = timezone.now
            new_proj = form.save()
            return redirect('divtags:project', new_proj.pk)
    else:
        form = NewProjectForm()
    
    context = {
        "title": "New Project",
        "form": form,
    }
    
    return render(request, 'divtags/newproject.html', context)

def profile(request):
    
    current_user = request.user
    publishedprojects = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
    publishedprojects = publishedprojects.filter(ispublished=True).count()
    
    context = {
        "title": "My  Profile",
        "publishedprojects": publishedprojects,
    }
    
    return render(request, 'divtags/profile.html', context)

def permissiondenied(request):
    
    context = {
        "title": "404",
    }
    
    return render(request, 'divtags/permissiondenied.html', context)