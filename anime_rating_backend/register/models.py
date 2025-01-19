from django.db import models

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
