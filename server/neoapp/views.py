from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .models import Neo4j
from rest_framework.views import APIView
import logging

# logger = logging.getLogger('django')
neo4j = Neo4j()

# 根据本体和实体查询
@csrf_exempt
@api_view(['get','post'])
def matchEntity(request,label,entity):
    # logger.info('label:'+ str(label))
    answer = neo4j.matchEntity(label,entity)
    return Response(answer)

@csrf_exempt
@api_view(['get','post'])
def matchRel(request):
    answers = []
    if (request.method == 'POST'):
        datas = request.data['entity']
    for data in datas:
        answer = neo4j.matchRel(data['label1'],data['entity'],data['rel'])
        if answer:
            for answer1 in answer:
                answers.append(answer1)
    return Response(answers)


@csrf_exempt
@api_view(['get','post'])
def labelAll(request):
    labels = []
    answers = neo4j.lableAll()
    if answers:
        for answer in answers:
            if str(answer['label'])=="['company']":
                answer['label']='company'
                answer['name']='公司'
            elif str(answer['label'])=="['person']":
                answer['label'] = 'person'
                answer['name']='人员'
            elif str(answer['label'])=="['role']":
                answer['label'] = 'role'
                answer['name']='角色'
            elif str(answer['label'])=="['mdmwsup']":
                answer['label'] = 'mdmwsup'
                answer['name'] = '外部供方主数据'
            else:
                answers=None
            if answers:
                labels.append(answer)
    return Response(labels)

@csrf_exempt
@api_view(['get','post'])
def typeAll(request):
    answer = neo4j.typeAll()
    return Response(answer)

@csrf_exempt
@api_view(['get','post'])
def entityTypeAll(request):
    answers = []
    datas = request.data['entity']
    for data in datas:
        answer = neo4j.matchRelEntity(data['label1'],data['entity'],data['label2'])
        if answer:
            for answer1 in answer:
                answers.append(answer1)
    return Response(answers)

@csrf_exempt
@api_view(['get','post'])
# def entityAll(request,entity):#*args
def entityAll(request):
    answers = []
    if (request.method == 'POST'):
        datas = request.data['entity']
    for data in datas:
        answer = neo4j.matchEntityAll(data)
        if answer:
            for answer1 in answer:
                answers.append(answer1)
    return Response(answers)

@csrf_exempt
@api_view(['get','post'])
# def entityAll(request,entity):#*args
def levelAll(request):
    answers = []
    if (request.method == 'POST'):
        datas = request.data['entity']
    for data in datas:
        answer = neo4j.matchLevelAll(data['label1'],data['entity'],data['level'])
        print(answers)
    if (len(answer)>0 and data['level']>'1'):
        list1 = []
        answer1 = {}
        # for k,v in answer[0].items():
        #     list.append(v)
        for k,v in answer[0].items():
            list1.append(v)
        for i in range(0, len(list1), 4):
            answer1['n1'] = list1[i]
            answer1['rel1'] = list1[i+1]
            answer1['n2'] = list1[i+2]
            answer1['label2'] = list1[i+3]
            answers.append(answer1)
        answers = answers
    else:
        answers = answer
    return Response(answers)

@csrf_exempt
@api_view(['get','post'])
# def entityAll(request,entity):#*args
def entity1Entity2(request):
    if (request.method == 'POST'):
        datas = request.data
    entity1 = datas['entity1']
    rel = datas['rel']
    entity2 = datas['entity2']
    # 只输入entity1
    if (len(entity1) != 0 and len(rel) == 0 and len(entity2) == 0):
        answer = neo4j.matchEntityAll(entity1)
        if (len(answer) > 0):
            return Response(answer)

    # 若只输入entity2则,则输出与entity2有直接关系的实体和关系
    if (len(entity2) != 0 and len(rel) == 0 and len(entity1) == 0):
        answer = neo4j.matchEntityAll1(entity2)
        if (len(answer) > 0):
            return Response(answer)

    # 若输入entity1和relation，则输出与entity1具有relation关系的其他实体
    if (len(entity1) != 0 and len(rel) != 0 and len(entity2) == 0):
        answer = neo4j.matchEntity1Rel(entity1,rel)
        if (len(answer) > 0):
            return Response(answer)
    # 若输入entity2和relation，则输出与entity2具有relation关系的其他实体
    if (len(entity2) != 0 and len(rel) != 0 and len(entity1) == 0):
        answer = neo4j.matchEntity2Rel(entity2, rel)
        if (len(answer) > 0):
            return Response(answer)
    # 若输入entity1和entity2,则输出entity1和entity2之间的最短路径
    if (len(entity1) != 0 and len(rel) == 0 and len(entity2) != 0):
        answer = neo4j.matchEntity1Entity(entity1, entity2)
        if (len(answer) > 0):
            return Response(answer)

    if (len(entity1) != 0 and len(entity2) != 0 and len(rel) != 0):
        answer = neo4j.matchEntity1RelEntity2(entity1, rel, entity2)
        if (len(answer) > 0):
            return Response(answer)
    # 全为空
    if (len(entity1) == 0 and len(rel) == 0 and len(entity2) == 0):
        answer=['您输入的关系或者实体有误，请重新输入']
    return Response(answer)


# 根据类查询
# class neoMerge(APIView):
#     @csrf_exempt
#     def get(self,request,*args, **kwargs):
#         answer = neo4j.typeAll()
#         return Response(answer)
#
#     @csrf_exempt
#     def post(self, request, *args, **kwargs):
#         entity = request.data
#         answer = neo4j.createEntity(entity)
#         return Response(answer)