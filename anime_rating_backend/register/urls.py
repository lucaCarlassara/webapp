from django.urls import path
from .views import register_user
from .views import get_anime_list
from .views import get_anime_details
from .views import SaveRatingView
from . import views
from .views import RatingDetailView
from .views import get_stats

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('animes/', get_anime_list, name='get_anime_list'),
    path('animes/<int:anime_id>/', get_anime_details, name='get_anime_details'),
    path('animes/<int:anime_id>/ratings/', SaveRatingView.as_view(), name='save_rating'),
    path('user-animes/<int:user_id>/', views.user_animes, name='user_animes'),
    path('animes/<int:anime_id>/ratings/<int:user_id>/', views.get_user_rating, name='get_user_rating'),
    path('animes/<int:anime_id>/ratings/<int:user_id>/', RatingDetailView.as_view(), name='rating-detail'),
    path("ratings-summary/", views.ratings_summary, name="ratings-summary"),
    path("stats/", get_stats, name="get_stats"),
]