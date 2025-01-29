from django.db import models
from django.contrib.auth.models import User

class Anime(models.Model):
    title = models.CharField(max_length=100)  # Nome dell'anime
    duration = models.CharField(max_length=100)
    typology = models.CharField(max_length=100)
    description = models.TextField(blank=True)  # Descrizione
    image_url = models.URLField(blank=True)  # URL immagine
    year = models.CharField(max_length=100)  # Anno di uscita
    genre = models.CharField(max_length=100, blank=True)  # Genere
    studio = models.CharField(max_length=100)  # Numero di episodi
    status = models.CharField(max_length=100) # finito o non finito

    def __str__(self):
        return self.title
    
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # L'utente che ha fatto la votazione
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)  # L'anime votato
    intro = models.IntegerField(null=True, blank=True)
    soundtrack = models.IntegerField(null=True, blank=True)
    plot = models.IntegerField(null=True, blank=True)
    animations = models.IntegerField(null=True, blank=True)
    unpredictability = models.IntegerField(null=True, blank=True)
    protagonist = models.IntegerField(null=True, blank=True)
    secondary_characters = models.IntegerField(null=True, blank=True)
    plot_armor = models.IntegerField(null=True, blank=True)
    character_development = models.IntegerField(null=True, blank=True)
    villains = models.IntegerField(null=True, blank=True)
    japanese_awkwardness = models.IntegerField(null=True, blank=True)
    story_flow = models.IntegerField(null=True, blank=True)
    dead_moments = models.IntegerField(null=True, blank=True)
    logical_character_choices = models.IntegerField(null=True, blank=True)
    fights = models.IntegerField(null=True, blank=True)
    character_design = models.IntegerField(null=True, blank=True)
    ending = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Quando è stata fatta la votazione

    def __str__(self):
        return f"Rating by {self.user.username} for {self.anime.title}"
