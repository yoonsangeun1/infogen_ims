from django.conf.urls import url, include
from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

app_name = 'skil_api'

urlpatterns = [
    url(r'^$', views.Skil_api_index.as_view(), name='skil_api'),
    url(r'^devEnrl/', views.devEnrl, name='devEnrl'),
    url(r'^prjMgmt/', views.prjMgmt, name='prjMgmt'),

    # mariadb test
    url(r'^maria/', views.maria.as_view(), name='maria'),
    url(r'^getMariaDB/', views.getMariaDB, name='getMariaDB'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)