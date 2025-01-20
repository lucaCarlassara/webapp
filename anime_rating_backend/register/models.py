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
    parameter1 = models.IntegerField(null=True, blank=True)  # Voto per il parametro 1
    parameter2 = models.IntegerField(null=True, blank=True)  # Voto per il parametro 2
    parameter3 = models.IntegerField(null=True, blank=True)  # Voto per il parametro 3
    created_at = models.DateTimeField(auto_now_add=True)  # Quando è stata fatta la votazione

    def __str__(self):
        return f"Rating by {self.user.username} for {self.anime.title}"
