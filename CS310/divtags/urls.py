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
    url(r'^project/sandbox/$', TemplateView.as_view(template_name='divtags/sandbox.html'), name='sandbox'),
]