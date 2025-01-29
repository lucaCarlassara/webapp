from django.contrib import admin
from .models import Anime, Rating

@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'studio', 'status', 'genre')
    list_editable = ('status',)
    search_fields = ('title',)
    list_filter = ('status', 'year', 'studio')

    fieldsets = (
        (None, {'fields': ('title', 'description', 'image_url', 'year', 'genre', 'studio', 'status', 'duration', 'typology')}),
        ('Parametri votabili', {'fields': (
            'intro', 'soundtrack', 'plot', 'animations', 'unpredictability', 'protagonist',
            'secondary_characters', 'plot_armor', 'character_development', 'villains',
            'japanese_awkwardness', 'story_flow', 'dead_moments', 'logical_character_choices',
            'fights', 'character_design', 'ending'
        )}),
    )
