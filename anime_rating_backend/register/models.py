from django.db import models
from django.contrib.auth.models import User

class Anime(models.Model):
    title = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    typology = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    year = models.CharField(max_length=100)
    genre = models.CharField(max_length=100, blank=True)
    studio = models.CharField(max_length=100)
    status = models.CharField(max_length=100)

    # Campi votabili (senza _votable)
    intro = models.BooleanField(default=False)
    soundtrack = models.BooleanField(default=False)
    plot = models.BooleanField(default=False)
    animations = models.BooleanField(default=False)
    unpredictability = models.BooleanField(default=False)
    protagonist = models.BooleanField(default=False)
    secondary_characters = models.BooleanField(default=False)
    plot_armor = models.BooleanField(default=False)
    character_development = models.BooleanField(default=False)
    villains = models.BooleanField(default=False)
    japanese_awkwardness = models.BooleanField(default=False)
    story_flow = models.BooleanField(default=False)
    dead_moments = models.BooleanField(default=False)
    logical_character_choices = models.BooleanField(default=False)
    fights = models.BooleanField(default=False)
    character_design = models.BooleanField(default=False)
    ending = models.BooleanField(default=False)

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
