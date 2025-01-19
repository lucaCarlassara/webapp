from django.urls import path
from .views import register_user
from .views import get_anime_list
from .views import get_anime_details

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('animes/', get_anime_list, name='get_anime_list'),
    path('animes/<int:anime_id>/', get_anime_details, name='get_anime_details'),
]