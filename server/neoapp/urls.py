from django.urls import path,re_path
from . import views

urlpatterns = [
    path('neoLabel/', views.labelAll),
    path('neoType/', views.typeAll),
    path('neoMatch/<str:label>/<str:entity>/', views.matchEntity),
    # path('neoRel/<str:label>/<str:entity>/<str:rel>/', views.matchRel),
    path('neoTypeEntity/', views.matchRel),
    # path('neomerge/', views.neoMerge.as_view()),
    path('neoEntity/', views.entityAll),
    # path('neoEntityType/<str:label1>/<str:entity>/<str:label2>/', views.entityTypeAll),
    path('neoEntityType/', views.entityTypeAll),
    path('neoLevel/', views.levelAll),
    path('neoEntity1Entity2/', views.entity1Entity2),
    # re_path(r'^neoRel/<str:label>/<str:entity>/(?P<rel>\S*)/$', views.matchRel),
]