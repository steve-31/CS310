from django.contrib.auth.models import User
from django.db.models import Q
from .models import Project

def userno_processor(request):
    numberusers = User.objects.all().count()
    return { "numberusers": numberusers }

def projectno_processor(request):
    numberprojects = Project.objects.all().count()
    return { "numberprojects": numberprojects }

def myprojects_processor(request):
    if request.user.is_authenticated():
        current_user = request.user
        myprojects = Project.objects.filter(Q(owner=current_user) | Q(contributors=current_user)).distinct()
    else:
        myprojects=""
    
    return { "myprojects": myprojects }
    