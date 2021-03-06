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
import subprocess
import shutil
from django.utils.encoding import smart_str
from django.core.serializers import serialize
from create_app import createApp

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Project, ProjectObject, ProjectAttributeType, ProjectVersion, ProjectVersionExperimental, ProjectImage
from .forms import SignUpForm, NewProjectForm
from django.contrib.auth.decorators import login_required
from datetime import datetime
from pip._vendor.lockfile import pidlockfile
from psycopg2.sql import NULL

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

def project_delete(request):
    projectid = request.POST.get('id')
    project = Project.objects.get(pk=projectid)
    project.delete()
    return JsonResponse({})

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
        
            return JsonResponse({'versionid': parent_version.id, 'versionNo': project.currversionno, 'iterationNo': project.curriterationno, 'experimentalNo': experimental_number, 'experimentalid':experimental_version.id, 'datetime': formattedDate})
    else:
        return render(request, 'divtags/project.html', {})
    
@login_required
def object_save(request, pid):
    new_object = request.POST.get('object')
    new_object = json.loads(new_object)
    
    project = Project.objects.get(pk=pid)
    json_file = project.file
    
    json_file['objects'].append(new_object)
    
    connections = request.POST.get('connections')
    connections = json.loads(connections)
    counter = 0
    for connection in connections['connections']:
        #connection = json.loads(connection)
        index = 0
        for object in json_file['objects']:
            if object['name'] == connection['targetObject']:
                json_file['objects'][index]['attributes'].append({ "name": "Connection", "type": "Reference", "details": connection['thisObject']})
                break
            index += 1
        counter += 1
    
    
    project.file = json_file
    project.save()
    
    return JsonResponse({'objects': json.dumps(json_file['objects'], separators=(',',':'))})

@login_required
def object_edit(request, pid):
    new_object = request.POST.get('object')
    new_object = json.loads(new_object)
    
    objectname = new_object['name']
    
    project = Project.objects.get(pk=pid)
    project_file = project.file
    
    index = 0
    for object in project_file['objects']:
        if object['name'] == objectname:
            project_file['objects'][index] = new_object
            break
        index += 1
        
    connections = request.POST.get('connections')
    connections = json.loads(connections)
    counter = 0
    for connection in connections['connections']:
        #connection = json.loads(connection)
        index = 0
        for object in project_file['objects']:
            if object['name'] == connection['targetObject']:
                project_file['objects'][index]['attributes'].append({ "name": "Connection", "type": "Reference", "details": connection['thisObject']})
                break
            index += 1
        counter += 1
    
    project.file = project_file
    project.save()
    
    return JsonResponse({'objects': json.dumps(project_file['objects'], separators=(',',':'))})
        
@login_required
def object_delete(request, pid):
    objectname = request.POST.get('object')
    project = Project.objects.get(pk=pid)
    project_file = project.file
    
    count = 0
    for object in project_file['objects']:
        if object['name'] == objectname:
            project_file['objects'].pop(count)
            break
        count += 1
    
    project.file = project_file
    project.save()
    
    return JsonResponse({ 'success': 'yes' })
    
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

def changeprojecttitle(request, pid):
    title = request.POST.get('newtitle')
    project = Project.objects.get(pk=pid)
    project.name = title
    project.lastedited = datetime.now()
    project.save()
    
    formattedDate = datetime.now().strftime("%b. %d, %Y, %I:%M %p")
    
    return JsonResponse({"datetime": formattedDate})

def changeprojectdesc(request, pid):
    desc = request.POST.get('newdesc')
    project = Project.objects.get(pk=pid)
    project.desc = desc
    project.lastedited = datetime.now()
    project.save()
    
    formattedDate = datetime.now().strftime("%b. %d, %Y, %I:%M %p")
    
    return JsonResponse({"datetime": formattedDate})

def changeprojectowner(request, pid):
    owner = request.POST.get('newowner')
    project = Project.objects.get(pk=pid)
    project.owner_id = owner
    project.lastedited = datetime.now()
    project.save()
    
    newowner = User.objects.get(pk=owner)
    newownerusername = newowner.username
    
    formattedDate = datetime.now().strftime("%b. %d, %Y, %I:%M %p")
    
    return JsonResponse({"ownerid":owner, "ownerusername": newownerusername, "datetime": formattedDate})

def changeprojectcontributors(request, pid):
    contributors = request.POST.get('contributors')
    contributors = json.loads(contributors)
    ownerincontributors = False
    project = Project.objects.get(pk=pid)
    project.lastedited = datetime.now()
    
    for oldcontributor in project.contributors.all():
        project.contributors.remove(oldcontributor)

    for newcontributor in contributors:
        if newcontributor == project.owner_id:
            ownerincontributors = True
        project.contributors.add(int(newcontributor))
    
    if ownerincontributors == False:
        project.contributors.add(project.owner_id)
    
    project.save()
        
    contributor_usernames = []
    for user in contributors:
        contributor_usernames.append(User.objects.get(pk=user).username)
    
    formattedDate = datetime.now().strftime("%b. %d, %Y, %I:%M %p")
        
    return JsonResponse({"usernames":contributor_usernames, "datetime": formattedDate})

def uploadLogoImage(request, pid):
    if request.method == 'POST':
        logo = request.FILES['project-logo']
        project = Project.objects.get(pk=pid)
        project.logo = logo
        project.save()
        
    return JsonResponse({"logo":project.logo.url, "name":project.name})

def uploadImage(request, pid):
    if request.method == 'POST':
        newimage = request.FILES['project-image']
        image = ProjectImage(image=newimage)
        image.save()
        project = Project.objects.get(pk=pid)
        project.images.add(image)
        project.save()
        
    return JsonResponse({"image": image.image.url})

def removeCurrentLogo(request, pid):
    if request.method == 'POST':
        project = Project.objects.get(pk=pid)
        project.logo = None
        project.save()
        
    return JsonResponse({"logo":"", "name":project.name})
        

def newproject(request):
    if request.method == 'POST':
        projname = request.POST.get('projname')
        projdesc = request.POST.get('projdesc')
        projowner = request.user
        jsonfile = {
            "name": projname, 
            "headerTextColour": "#000000", 
            "headerBackgroundColour": "#ffffff",
            "objects": [
                {
                    "attributes": [
                        {
                            "type": "primaryKey", 
                             "name": "primary_key", 
                             "details": ""
                        }, 
                        {
                            "type": "Text", 
                            "name": "username", 
                            "details": ""
                        }, 
                        {
                            "type": "Text", 
                             "name": "first_name", 
                             "details": ""
                        }, 
                        {
                            "type": "Text", 
                            "name": "last_name", 
                            "details": ""
                        }, 
                        {
                            "type": "Text", 
                            "name": "email", 
                            "details": ""
                        }, 
                        {
                            "type": "Text", 
                            "name": "password", 
                            "details": ""
                        }, 
                        {
                            "type": "Date", 
                            "name": "last_login", 
                            "details": ""
                        }
                    ], 
                    "name": "User", 
                    "desc": "User's required for project"
                }
            ], 
            "pages": [
                {
                    "name": "AllPages", 
                    "elements":[]
                }, 
                {
                    "name": "Home", 
                    "elements": [], 
                    "forms": [], 
                    "queries": [], 
                    "multiqueries": [],
                    "links": [],
                    "permissions": "public", 
                    "background":"#ffffff", 
                    "homepage":"yes", 
                    "showinheader":"yes", 
                    "showallpages":"yes", 
                    "pageObject": "none"
                }, 
                {
                    "elements": [
                        {
                            "content": "<form class=\"element\" id=\"21\" onclick=\"selectElement(this.id)\" style=\"color: rgb(0, 0, 0); background-color: rgba(0, 0, 0, 0); padding: 0px; top: 180px; width: 610px; height: 370px; left: 20px;\"><i class=\"icon-line-cross form-field-delete\" id=\"field0\" style=\"display: none;\"></i><label> &nbsp;username</label><input type=\"text\" class=\"form-control user-form\"><i class=\"icon-line-cross form-field-delete\" id=\"field1\" style=\"display: none;\"></i><label> &nbsp;first_name</label><input type=\"text\" class=\"form-control user-form\"><i class=\"icon-line-cross form-field-delete\" id=\"field2\" style=\"display: none;\"></i><label> &nbsp;last_name</label><input type=\"text\" class=\"form-control user-form\"><i class=\"icon-line-cross form-field-delete\" id=\"field3\" style=\"display: none;\"></i><label> &nbsp;email</label><input type=\"text\" class=\"form-control user-form\"><i class=\"icon-line-cross form-field-delete\" id=\"field4\" style=\"display: none;\"></i><label> &nbsp;password</label><input type=\"text\" class=\"form-control user-form\"><button disabled=\"\" class=\"btn btn-default\">Submit</button></form>"
                        }, 
                        {
                            "content": "<h1 class=\"element\" id=\"22\" onclick=\"selectElement(this.id)\" style=\"color: rgb(0, 0, 0); background-color: rgba(0, 0, 0, 0); padding: 0px; top: 90px; left: 20px;\">This is a Heading</h1>"
                        }
                    ], 
                    "showallpages": "no", 
                    "name": "Register", 
                    "forms": [
                        {
                            "fields": [
                                {
                                    "type": "primaryKey", 
                                    "label": "primary_key"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "username"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "first_name"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "last_name"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "email"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "password"
                                }
                            ], 
                            "object": "User", 
                            "type": "add", 
                            "id": 21
                        }
                    ], 
                    "queries": [], 
                    "multiqueries": [],
                    "links": [],
                    "showinheader": "yes", 
                    "background": "#ffffff", 
                    "homepage": "no", 
                    "permissions": "public",
                    "pageObject": "none"
                }, 
                {
                    "elements": [
                        {
                            "content": "<form class=\"element\" id=\"9\" onclick=\"selectElement(this.id)\" style=\"color: rgb(0, 0, 0); background-color: rgba(0, 0, 0, 0); padding: 0px; top: 180px; left: 30px; width: 530px; height: 210px;\"><i class=\"icon-line-cross form-field-delete\" id=\"field0\" style=\"display: none;\"></i><label> &nbsp;username</label><input type=\"text\" class=\"form-control user-form\"><i class=\"icon-line-cross\" id=\"field1\" style=\"display: none;\"></i><label style=\"display: none;\"> &nbsp;first_name</label><input type=\"text\" class=\"form-control user-form\" style=\"display: none;\"><i class=\"icon-line-cross\" id=\"field2\" style=\"display: none;\"></i><label style=\"display: none;\"> &nbsp;last_name</label><input type=\"text\" class=\"form-control user-form\" style=\"display: none;\"><i class=\"icon-line-cross\" id=\"field3\" style=\"display: none;\"></i><label style=\"display: none;\"> &nbsp;email</label><input type=\"text\" class=\"form-control user-form\" style=\"display: none;\"><i class=\"icon-line-cross form-field-delete\" id=\"field4\" style=\"display: none;\"></i><label> &nbsp;password</label><input type=\"text\" class=\"form-control user-form\"><button disabled=\"\" class=\"btn btn-default\">Submit</button></form>"
                        }, 
                        {
                            "content": "<h1 class=\"element\" id=\"10\" onclick=\"selectElement(this.id)\" style=\"color: rgb(0, 0, 0); background-color: rgba(0, 0, 0, 0); padding: 0px; top: 90px; left: 20px;\">This is a Heading</h1>"
                        }
                    ], 
                    "showallpages": "yes", 
                    "name": "Login", 
                    "forms": [
                        {
                            "fields": [
                                {
                                    "type": "primaryKey", 
                                    "label": "primary_key"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "username"
                                }, 
                                {
                                    "type": "Text", 
                                    "label": "password"
                                }
                            ], 
                            "object": "User", 
                            "type": "verify", 
                            "id": 9
                        }
                    ], 
                    "queries": [], 
                    "multiqueries": [],
                    "links": [],
                    "showinheader": "yes", 
                    "background": "#ffffff", 
                    "homepage": "no", 
                    "permissions": "public",
                    "pageObject": "none"
                }
            ]
        }
        newproject = Project(name=projname, desc=projdesc, owner=projowner, lastedited=datetime.now(), ispublished=False, currversionno=0, curriterationno=1, file=jsonfile)
        newproject.save()
        
        newproject.contributors.add(request.user)
        newproject.save()
        
        firstVersion = ProjectVersion(project=newproject, datetime=datetime.now(), versionno=0, iterationno=1, file=jsonfile)
        firstVersion.save()
        
        return redirect('divtags:project', newproject.pk)
    
    context = {
        "title": "New Project",
    }
    
    return render(request, 'divtags/newproject.html', context)

def previewApplication(request, pid):
    project = Project.objects.get(pk=pid)
    application = project.file
    
    
    ####  IF MONGODB IS NOT RUNNING THEN START THE MONDO DATABASE  ####
    
    for image in project.images.all():
        image_url = image.image.url.split("/")
        image_name = image_url[len(image_url)-1]
        
        subprocess.Popen("copy \"img\\ProjectImages\\"+image_name+"\" \"..\\..\\sample\\app\\static\\img\"", cwd="CS310/media", shell=True)
    if project.logo:
        logo_url = project.logo.name.split("/")
        logo_name = logo_url[len(logo_url)-1]
        
        subprocess.Popen("copy \"img\\ProjectLogos\\"+logo_name+"\" \"..\\..\\sample\\app\\static\\img\\logo.PNG\"", cwd="CS310/media", shell=True)
        
    createApp(application, project.logo)          #creates flask app config file & html files
    
    ####  RUN FLASK APP  ####
    
#     shutil.make_archive(project.name, 'zip', './sample')
    
    
#     response = HttpResponse(content_type='application/force-download') # mimetype is replaced by content_type for django 1.7
#     response['Content-Disposition'] = 'attachment; filename=%s' % smart_str(project.name)
#     response['X-Sendfile'] = smart_str('./')
#     return response
    #os.execle('./sample','sampleApp.py', python)
    #os.environ["FLASK_APP"] = "sampleApp.py"
    #subprocess.Popen("flask run", cwd="sample", shell=True)
    #os.fork/exec
    
    context = {
        "title": "Preview Application",
        "project_id": pid,
    }
    
    return render(request, 'divtags/previewapp.html', context)

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