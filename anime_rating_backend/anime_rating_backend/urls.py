from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from register.views import CustomTokenObtainPairView, home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Usa la vista personalizzata
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', include('register.urls')),  # Endpoint per la registrazione
    path('api/', include('register.urls')),
    path('', home, name='home'),
]

