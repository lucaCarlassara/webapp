from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Rating, Anime
from django.db.models import Avg

@api_view(['GET'])
def ratings_summary(request):
    # Calcola le medie dei voti per ciascun parametro
    ratings = (
        Rating.objects.values("anime_id")
        .annotate(
            parameter1_avg=Avg("parameter1"),
            parameter2_avg=Avg("parameter2"),
            parameter3_avg=Avg("parameter3"),
        )
        .order_by("-parameter1_avg", "-parameter2_avg", "-parameter3_avg")
    )

    # Serializza i dati includendo i dettagli degli anime
    data = [
        {
            "id": r["anime_id"],
            "title": Anime.objects.get(id=r["anime_id"]).title,
            "image_url": Anime.objects.get(id=r["anime_id"]).image_url,
            "parameter1": r["parameter1_avg"] or 0,
            "parameter2": r["parameter2_avg"] or 0,
            "parameter3": r["parameter3_avg"] or 0,
        }
        for r in ratings
    ]

    return Response(data)

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
        print("Errore durante la registrazione:", str(e))
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
    
@api_view(['GET'])
def user_animes(request, user_id):
    # Anime votati dall'utente
    voted = Anime.objects.filter(rating__user_id=user_id)
    
    # Anime da votare
    to_vote = Anime.objects.exclude(rating__user_id=user_id)

    # Serializza i dati
    voted_data = [{"id": anime.id, "title": anime.title} for anime in voted]
    to_vote_data = [{"id": anime.id, "title": anime.title} for anime in to_vote]

    return Response({
        "voted": voted_data,
        "to_vote": to_vote_data,
    })

@api_view(['GET'])
def get_user_rating(request, anime_id, user_id):
    try:
        # Cerca la valutazione per l'anime e l'utente specifici
        rating = Rating.objects.get(anime_id=anime_id, user_id=user_id)
        return Response({
            "parameter1": rating.parameter1,
            "parameter2": rating.parameter2,
            "parameter3": rating.parameter3,
        })
    except Rating.DoesNotExist:
        return Response({"error": "Rating not found"}, status=404)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Aggiungi l'username al payload del token
        token['username'] = user.username

        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SaveRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, anime_id):
        user = request.user
        anime = Anime.objects.get(id=anime_id)
        data = request.data

        # Controlla se esiste già una votazione per questo utente e questo anime
        rating, created = Rating.objects.get_or_create(user=user, anime=anime)

        # Aggiorna i voti
        rating.parameter1 = data.get("parameter1", rating.parameter1)
        rating.parameter2 = data.get("parameter2", rating.parameter2)
        rating.parameter3 = data.get("parameter3", rating.parameter3)
        rating.save()

        return Response({"message": "Rating saved successfully."}, status=status.HTTP_200_OK)
    
class RatingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, anime_id, user_id):
        try:
            rating = Rating.objects.get(anime_id=anime_id, user_id=user_id)
            return Response({
                "parameter1": rating.parameter1,
                "parameter2": rating.parameter2,
                "parameter3": rating.parameter3,
            })
        except Rating.DoesNotExist:
            return Response({"error": "Rating not found."}, status=404)
