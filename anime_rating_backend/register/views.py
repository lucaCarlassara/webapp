from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Anime
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    try:
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User registered successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
def get_anime_list(request):
    animes = Anime.objects.all()
    anime_data = [
        {
            "id": anime.id,
            "title": anime.title,
            "duration": anime.duration,
            "typology": anime.typology,
            "description": anime.description,
            "image_url": anime.image_url,
            "year": anime.year,
            "genre": anime.genre,
            "studio": anime.studio,
            "status": anime.status,
        }
        for anime in animes
    ]
    return Response(anime_data)

@api_view(['GET'])
def get_anime_details(request, anime_id):
    try:
        anime = Anime.objects.get(id=anime_id)
        anime_data = {
            "id": anime.id,
            "title": anime.title,
            "description": anime.description,
            "image_url": anime.image_url,
            "year": anime.year,
            "genre": anime.genre,
            "studio": anime.studio,
            "status": anime.status,
            "duration": anime.duration,
            "typology": anime.typology,
        }
        return Response(anime_data)
    except Anime.DoesNotExist:
        return Response({"error": "Anime not found"}, status=404)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Aggiungi l'username al payload del token
        token['username'] = user.username

        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer