from django.conf.urls import url, include
from . import views

from django.conf import settings
from django.conf.urls.static import static

app_name = 'stat_api'

urlpatterns = [
    url(r'^$', views.Stat_api_index.as_view(), name='stat_api'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)