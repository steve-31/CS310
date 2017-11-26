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
from .models import Project, ProjectObject, ProjectAttributeType, ProjectVersion, ProjectVersionExperimental
from .forms import SignUpForm, NewProjectForm
from django.contrib.auth.decorators import login_required
from datetime import datetime

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
    
    projectversions = ProjectVersion.objects.filter(project = project).order_by('-versionno').order_by('-iterationno')
    if project.ispublished:
        deployedversion = ProjectVersion.objects.get(project=project, versionno=project.pubversionno, iterationno=project.pubiterationno)
    else: 
        deployedversion = None
        
    currentversion = ProjectVersion.objects.get(project=project, versionno=project.currversionno, iterationno=project.curriterationno)
    
    context = {
        "title": "Project",
        "project": project,
        "users": users,
        "projectdir": projectdir,
        "objects": projectobj,
        "attribute_types": attribute_types,
        "projectversions": projectversions,
        "deployedversion": deployedversion,
        "currentversion": currentversion,
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
        project.lastedited = datetime.now()
        project.file = json_file
        project.save()
        
        if project.currexperimentalno == None:
            print('normal')
            version_file = project.file
            last_version = ProjectVersion.objects.filter(project=project).order_by('-datetime')[:1]
            for version in last_version:
                version_number = version.versionno
                iteration_number = version.iterationno
            iteration_number += 1
            version = ProjectVersion(project = project, versionno = version_number, iterationno = iteration_number, datetime = project.lastedited, file = version_file)
            version.save()
            formattedDate = version.datetime.strftime("%b. %d, %Y, %I:%M %p")
            
            project.currversionno = version_number
            project.curriterationo = iteration_number
            project.save()
            return JsonResponse({'versionid': version.id, 'versionNo': version_number, 'iterationNo': iteration_number, 'experimentalNo': 0, 'datetime': formattedDate})
        else:
            print('experimental')
            version_file = project.file
            parent_version = ProjectVersion.objects.get(project=project, versionno=project.currversionno, iterationno=project.curriterationno)
            experimental_number = project.currexperimentalno + 1
            experimental_version = ProjectVersionExperimental(experimentalno = experimental_number, datetime = project.lastedited, file = version_file)
            experimental_version.save()
            parent_version.experimentals.add(experimental_version)
            parent_version.datetime = datetime.now()
            parent_version.save()
            formattedDate = parent_version.datetime.strftime("%b. %d, %Y, %I:%M %p")
            
            project.currexperimentalno = experimental_number
            project.save()
        
            return JsonResponse({'versionid': parent_version.id, 'versionNo': project.currversionno, 'iterationNo': project.curriterationno, 'experimentalNo': experimentalno, 'datetime': formattedDate})
    else:
        return render(request, 'divtags/project.html', {})
    
@login_required
def project_restore(request, pid, exp):
    if exp == "0":
        version = ProjectVersion.objects.get(pk=pid)
        project = version.project
        projectid = project.id
        
        current_user = request.user
        
        try:
            projecttest = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
            projecttest = projecttest.get(pk=projectid)
        except Project.DoesNotExist:
            return redirect('permissiondenied')
        
        project.file = version.file
        project.currversionno = version.versionno
        project.curriterationno = version.iterationno
        project.currexperimentalno = None
        project.save()
    elif exp == "1":
        experimental = ProjectVersionExperimental.objects.get(pk=pid)
        version = ProjectVersion.objects.get(experimentals__id = experimental.id)
        project = version.project
        projectid = project.id
        
        current_user = request.user
        
        try:
            projecttest = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
            projecttest = projecttest.get(pk=projectid)
        except Project.DoesNotExist:
            return redirect('permissiondenied')
        
        project.file = experimental.file
        project.currversionno = version.versionno
        project.curriterationno = version.iterationno
        project.currexperimentalno = experimental.experimentalno
        project.save()
    
    return redirect('divtags:project', pid=projectid)

@login_required
def project_deploy(request, pid):
    current_user = request.user
    
    try:
        projecttest = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
        projecttest = projecttest.get(pk=pid)
    except Project.DoesNotExist:
        return redirect('permissiondenied')
    
    project = Project.objects.get(pk=pid)
    
    if request.method == "POST":
        
        vno = request.POST.get('vno')
        vno = json.loads(vno)
        itno = request.POST.get('itno')
        itno = json.loads(itno)
    
        project.ispublished = True
        project.pubversionno = vno
        project.pubiterationno = itno
        project.pubdate = datetime.now()
        
        print("DEPLOY VERSION " + vno + "." + itno)
        
        version = ProjectVersion.objects.get(project=project, versionno=vno, iterationno=itno)
        
        project.save()
        
        return JsonResponse({ 'versionNumber': vno, 'iterationNumber': itno, 'id':version.id })
    
    return redirect('divtags:project', pid=projectid)

@login_required
def project_deploy_link(request, vid):
    version = ProjectVersion.objects.get(pk=vid)
    project = version.project
    
    project.ispublished = True
    project.pubversionno = version.versionno
    project.pubiterationno = version.iterationno
    project.pubdate = datetime.now()
    
    print("DEPLOY VERSION " + str(version.versionno) + "." + str(version.iterationno))
    
    project.save()
    
    return redirect('divtags:project', pid=project.id)

@login_required
def project_branch(request, pid):
        
    version = ProjectVersion.objects.get(pk=pid)
    project = version.project
    version_file = version.file
    experimental_number = 0
    for exp in version.experimentals.all():
        if exp.experimentalno > experimental_number:
            experimental_number = exp.experimentalno
            version_file = exp.file
    experimental_number += 1
    experimental = ProjectVersionExperimental(experimentalno = experimental_number, datetime = datetime.now(), file = version_file)
    experimental.save()

    version.experimentals.add(experimental)
    version.datetime = datetime.now()
    version.save()
    
    project.lastedited = datetime.now()
    project.file = version_file
    project.currversionno = version.versionno
    project.curriterationno = version.iterationno
    project.currexperimentalno = experimental_number
    project.save()
    
    return redirect('divtags:project', pid=project.id)

@login_required
def project_merge(request, eid):
    experimental = ProjectVersionExperimental.objects.get(pk=eid)
    version = ProjectVersion.objects.get(experimentals__id = experimental.id)
    project = version.project
    projectid = project.id
    
    version.file = experimental.file
    version.datetime = datetime.now()
    version.save()
    
    project.lastedited = datetime.now()
    project.file = version.file
    project.currversionno = version.versionno
    project.curriterationno = version.iterationno
    project.currexperimentalno = None
    project.save()
    
    return redirect('divtags:project', pid=projectid)

def project_version_delete(request, vid, exp):
    
    if exp == "0":
        version = ProjectVersion.objects.get(pk=vid)
        project = version.project
        version.delete()
    elif exp == "1":
        experimental = ProjectVersionExperimental.objects.get(pk=vid)
        version = ProjectVersion.objects.get(experimentals__id = experimental.id)
        project = version.project
        experimental.delete()
        
    return redirect('divtags:project', pid=project.id)
        

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