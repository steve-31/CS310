from django.conf.urls import url
from django.views.generic import TemplateView

from . import views

app_name = 'divtags'
urlpatterns = [
    url(r'^$', views.index, name='home'),
    
    url(r'^examples/$', views.examples, name='examples'),
    
    url(r'^project/$', views.myprojectlist, name='myprojectlist'),
    url(r'^project/(?P<pid>[0-9]+)/$', views.project, name='project'),
    url(r'^project/new/$', views.newproject, name='newproject'),
    url(r'^project/file/$', TemplateView.as_view(template_name='divtags/project-content.html'), name='projectfile'),
    url(r'^project/save/(?P<pid>[0-9]+)/$', views.project_save, name='project_save'),
    url(r'^project/(?P<pid>[0-9]+)/object/save/$', views.object_save, name='object_save'),
    url(r'^project/(?P<pid>[0-9]+)/object/edit/$', views.object_edit, name='object_edit'),
    url(r'^project/(?P<pid>[0-9]+)/restore/(?P<exp>[0,1])/$', views.project_restore, name='project_restore'),
    url(r'^project/(?P<pid>[0-9]+)/deploy/$', views.project_deploy, name='project_deploy'),
    url(r'^project/deploy/link/(?P<vid>[0-9]+)/$', views.project_deploy_link, name='project_deploy_link'),
    url(r'^project/(?P<pid>[0-9]+)/branch/$', views.project_branch, name='project_branch'),
    url(r'^project/merge/(?P<eid>[0-9]+)/$', views.project_merge, name='project_merge'),
    url(r'^project/version/delete/(?P<vid>[0-9]+)/(?P<exp>[0,1])/$', views.project_version_delete, name='project_version_delete'),
    url(r'^project/(?P<pid>[0-9]+)/object/delete', views.object_delete, name="object_delete"),
]