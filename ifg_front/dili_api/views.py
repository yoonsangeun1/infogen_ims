from django.shortcuts import render, redirect

# Create your views here.
from django.views import View
from django.views import generic
from django.http import JsonResponse

from django.core.paginator import Paginator
#from .models import Tb_page

from django.views.decorators.csrf import csrf_exempt
# from .models import TB_EMP,Cd

import requests
import logging
import json

logger = logging.getLogger(__name__)

class Dili_api_index(generic.TemplateView):
    def get(self, request, *args, **kwargs):
        template_name = 'dili/index.html'

        return render(request, template_name)

class scheduleMgmt(generic.TemplateView):
    def get(self, request, *args, **kwargs):
        template_name = 'dili/diliScheduleMgmt.html'

        # r = requests.get('http://dili_api:5006/hello')
        # rr = {
        #     "result": r.text
        # }

        return render(request, template_name)
        # return render(request, template_name, rr)

class mariatest(generic.TemplateView):
    def get(self, request, *args, **kwargs):
        template_name = 'dili/mariatest.html'
        # 화면 호출
        r = requests.get('http://dili_api:5006/hello')
        rr = {
            "result": r.text
        }

        return render(request, template_name, rr)

def getMaria(request):
    param = json.loads(request.GET['param'])

    logger.info("Start")
    logger.info(param)
    logger.info("End")

    # api 호출
    r = requests.get('http://dili_api:5006/mariatestDB')
    logger.info(r)
    logger.info(r.text)
    logger.info(r.json())
    logger.info(json.loads(r.text))
    return JsonResponse(r.json(), safe=False)

def getWrkTimeInfoByEml(request):
    param = json.loads(request.GET['param'])

    logger.info("Parameters Start")
    logger.info(param)
    logger.info("Parameters End")

    # api 호출
    r = requests.get('http://dili_api:5006/wrkTimeInfoByEml', json=param)
    logger.info(r)
    logger.info(r.text)
    logger.info(r.json())
    logger.info(json.loads(r.text))
    return JsonResponse(r.json(), safe=False)