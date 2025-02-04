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
from django.http import HttpResponse
from .serializers import AnimeSerializer
from django.contrib.auth.models import User
from django.db.models import Count

def home(request):
    return HttpResponse("Il backend è attivo e funzionante!")

@api_view(['GET'])
def get_anime_vote_count(request, anime_id):
    try:
        vote_count = Rating.objects.filter(anime_id=anime_id).values("user_id").distinct().count()
        return Response({"total_votes": vote_count})
    except Anime.DoesNotExist:
        return Response({"error": "Anime not found"}, status=404)

@api_view(['GET'])
def get_stats(request):
    total_animes = Anime.objects.count()
    total_users = User.objects.count()
    total_votes = Rating.objects.count()

    return Response({
        "totalAnimes": total_animes,
        "totalUsers": total_users,
        "totalVotes": total_votes * 17,
    })

@api_view(['GET'])
def ratings_summary(request):
    # Calcola le medie dei voti per ciascun parametro
    ratings = (
        Rating.objects.values("anime_id")
        .annotate(
            intro_avg=Avg("intro"),
            soundtrack_avg=Avg("soundtrack"),
            plot_avg=Avg("plot"),
            animations_avg=Avg("animations"),
            unpredictability_avg=Avg("unpredictability"),
            protagonist_avg=Avg("protagonist"),
            secondary_characters_avg=Avg("secondary_characters"),
            plot_armor_avg=Avg("plot_armor"),
            character_development_avg=Avg("character_development"),
            villains_avg=Avg("villains"),
            japanese_awkwardness_avg=Avg("japanese_awkwardness"),
            story_flow_avg=Avg("story_flow"),
            dead_moments_avg=Avg("dead_moments"),
            logical_character_choices_avg=Avg("logical_character_choices"),
            fights_avg=Avg("fights"),
            character_design_avg=Avg("character_design"),
            ending_avg=Avg("ending"),
        )
        .order_by("-intro_avg", "-soundtrack_avg", "-plot_avg", "-animations_avg", "-unpredictability_avg", "-protagonist_avg", "-secondary_characters_avg", "-plot_armor_avg", "-character_development_avg", "-villains_avg", "-japanese_awkwardness_avg", "-story_flow_avg", "-dead_moments_avg", "-logical_character_choices_avg", "-fights_avg", "-character_design_avg", "-ending_avg")
    )

    # Serializza i dati includendo i dettagli degli anime
    data = [
        {
            "id": r["anime_id"],
            "title": Anime.objects.get(id=r["anime_id"]).title,
            "image_url": Anime.objects.get(id=r["anime_id"]).image_url,
            "intro": r["intro_avg"] or 0,
            "soundtrack": r["soundtrack_avg"] or 0,
            "plot": r["plot_avg"] or 0,
            "animations": r["animations_avg"] or 0,
            "unpredictability": r["unpredictability_avg"] or 0,
            "protagonist": r["protagonist_avg"] or 0,
            "secondary_characters": r["secondary_characters_avg"] or 0,
            "plot_armor": r["plot_armor_avg"] or 0,
            "character_development": r["character_development_avg"] or 0,
            "villains": r["villains_avg"] or 0,
            "japanese_awkwardness": r["japanese_awkwardness_avg"] or 0,
            "story_flow": r["story_flow_avg"] or 0,
            "dead_moments": r["dead_moments_avg"] or 0,
            "logical_character_choices": r["logical_character_choices_avg"] or 0,
            "fights": r["fights_avg"] or 0,
            "character_design": r["character_design_avg"] or 0,
            "ending": r["ending_avg"] or 0,
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
        anime_data = AnimeSerializer(anime).data

        # Filtra solo i parametri votabili
        votable_parameters = {key: value for key, value in anime_data.items() if isinstance(value, bool) and value}

        response_data = {
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
            "votable_parameters": list(votable_parameters.keys())  # Restituisce i nomi dei parametri votabili
        }
        return Response(response_data)
    except Anime.DoesNotExist:
        return Response({"error": "Anime not found"}, status=404)
    
@api_view(['GET'])
def user_animes(request, user_id):
    # Anime votati dall'utente
    voted = Anime.objects.filter(rating__user_id=user_id)
    
    # Anime da votare
    to_vote = Anime.objects.exclude(rating__user_id=user_id)

    # Serializza i dati con l'image_url incluso
    voted_data = [
        {
            "id": anime.id,
            "title": anime.title,
            "image_url": anime.image_url  # Include image_url
        }
        for anime in voted
    ]
    to_vote_data = [
        {
            "id": anime.id,
            "title": anime.title,
            "image_url": anime.image_url  # Include image_url
        }
        for anime in to_vote
    ]

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
            "intro": rating.intro,
            "soundtrack": rating.soundtrack,
            "plot": rating.plot,
            "animations": rating.animations,
            "unpredictability": rating.unpredictability,
            "protagonist": rating.protagonist,
            "secondary_characters": rating.secondary_characters,
            "plot_armor": rating.plot_armor,
            "character_development": rating.character_development,
            "villains": rating.villains,
            "japanese_awkwardness": rating.japanese_awkwardness,
            "story_flow": rating.story_flow,
            "dead_moments": rating.dead_moments,
            "logical_character_choices": rating.logical_character_choices,
            "fights": rating.fights,
            "character_design": rating.character_design,
            "ending": rating.ending,
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
        rating.intro = data.get("intro", rating.intro)
        rating.soundtrack = data.get("soundtrack", rating.soundtrack)
        rating.plot = data.get("plot", rating.plot)
        rating.animations = data.get("animations", rating.animations)
        rating.unpredictability = data.get("unpredictability", rating.unpredictability)
        rating.protagonist = data.get("protagonist", rating.protagonist)
        rating.secondary_characters = data.get("secondary_characters", rating.secondary_characters)
        rating.plot_armor = data.get("plot_armor", rating.plot_armor)
        rating.character_development = data.get("character_development", rating.character_development)
        rating.villains = data.get("villains", rating.villains)
        rating.japanese_awkwardness = data.get("japanese_awkwardness", rating.japanese_awkwardness)
        rating.story_flow = data.get("story_flow", rating.story_flow)
        rating.dead_moments = data.get("dead_moments", rating.dead_moments)
        rating.logical_character_choices = data.get("logical_character_choices", rating.logical_character_choices)
        rating.fights = data.get("fights", rating.fights)
        rating.character_design = data.get("character_design", rating.character_design)
        rating.ending = data.get("ending", rating.ending)
        rating.save()

        return Response({"message": "Rating saved successfully."}, status=status.HTTP_200_OK)
    
class RatingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, anime_id, user_id):
        try:
            rating = Rating.objects.get(anime_id=anime_id, user_id=user_id)
            return Response({
                "intro": rating.intro,
                "soundtrack": rating.soundtrack,
                "plot": rating.plot,
                "animations": rating.animations,
                "unpredictability": rating.unpredictability,
                "protagonist": rating.protagonist,
                "secondary_characters": rating.secondary_characters,
                "plot_armor": rating.plot_armor,
                "character_development": rating.character_development,
                "villains": rating.villains,
                "japanese_awkwardness": rating.japanese_awkwardness,
                "story_flow": rating.story_flow,
                "dead_moments": rating.dead_moments,
                "logical_character_choices": rating.logical_character_choices,
                "fights": rating.fights,
                "character_design": rating.character_design,
                "ending": rating.ending,
            })
        except Rating.DoesNotExist:
            return Response({"error": "Rating not found."}, status=404)
