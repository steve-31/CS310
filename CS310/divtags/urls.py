from django.conf.urls import url
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

from . import views

app_name = 'divtags'
urlpatterns = [
    url(r'^$', views.index, name='home'),
    
    url(r'^examples/$', views.examples, name='examples'),
    
    url(r'^project/$', views.myprojectlist, name='myprojectlist'),
    url(r'^project/delete/$', views.project_delete, name='project_delete'),
    url(r'^project/(?P<pid>[0-9]+)/$', views.project, name='project'),
    url(r'^project/(?P<pid>[0-9]+)/changetitle/$', views.changeprojecttitle, name='changeprojecttitle'),
    url(r'^project/(?P<pid>[0-9]+)/changedesc/$', views.changeprojectdesc, name='changeprojectdesc'),
    url(r'^project/(?P<pid>[0-9]+)/changeowner/$', views.changeprojectowner, name='changeprojectowner'),
    url(r'^project/(?P<pid>[0-9]+)/changecontributors/$', views.changeprojectcontributors, name='changeprojectcontributors'),
    url(r'^project/new/$', views.newproject, name='newproject'),
    url(r'^project/file/$', TemplateView.as_view(template_name='divtags/project-content.html'), name='projectfile'),
    url(r'^project/save/(?P<pid>[0-9]+)/$', views.project_save, name='project_save'),
    url(r'^project/(?P<pid>[0-9]+)/object/save/$', views.object_save, name='object_save'),
    url(r'^project/(?P<pid>[0-9]+)/object/edit/$', views.object_edit, name='object_edit'),
    url(r'^project/(?P<pid>[0-9]+)/restore/(?P<exp>[0,1])/$', views.project_restore, name='project_restore'),
    url(r'^project/(?P<pid>[0-9]+)/deploy/$', views.project_deploy, name='project_deploy'),
    url(r'^project/deploy/link/(?P<vid>[0-9]+)/$', views.project_deploy_link, name='project_deploy_link'),
    url(r'^project/(?P<pid>[0-9]+)/preview/$', views.previewApplication, name='project_preview'),
    url(r'^project/(?P<pid>[0-9]+)/branch/$', views.project_branch, name='project_branch'),
    url(r'^project/merge/(?P<eid>[0-9]+)/$', views.project_merge, name='project_merge'),
    url(r'^project/version/delete/(?P<vid>[0-9]+)/(?P<exp>[0,1])/$', views.project_version_delete, name='project_version_delete'),
    url(r'^project/(?P<pid>[0-9]+)/object/delete/$', views.object_delete, name="object_delete"),
    url(r'^project/(?P<pid>[0-9]+)/logoupload/$', views.uploadLogoImage, name="logoUpload"),
    url(r'^project/(?P<pid>[0-9]+)/imageupload/$', views.uploadImage, name="imageUpload"),
    url(r'^project/(?P<pid>[0-9]+)/logoremove/$', views.removeCurrentLogo, name="logoRemove"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)