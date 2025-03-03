from pathlib import Path
from decouple import config, UndefinedValueError
from decouple import Config, RepositoryEnv

try:
    SECRET_KEY = config('SECRET_KEY')  # Forza il caricamento delle variabili
except UndefinedValueError:
    print("Il file .env non è stato caricato correttamente!")

config = Config(RepositoryEnv('.env.local'))

# Percorsi base
BASE_DIR = Path(__file__).resolve().parent.parent

# Sicurezza
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ENVIRONMENT = config('ENVIRONMENT', default='production')  # Identifica l'ambiente (development/production)
print(f"ENVIRONMENT: {ENVIRONMENT}")  # Aggiungi questa riga
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Applicazioni installate
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'register',
    'corsheaders',  # Aggiungi corsheaders
]

# Configurazione REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Deve essere PRIMA di CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URL e WSGI
ROOT_URLCONF = 'anime_rating_backend.urls'
WSGI_APPLICATION = 'anime_rating_backend.wsgi.application'

# Configurazione database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', cast=int),
    }
}

# Validazione password
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internazionalizzazione
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# File statici
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

# Configurazione dei template
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Cartella per template personalizzati
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Sicurezza per host autorizzati
if ENVIRONMENT == 'development':
    ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
else:
    ALLOWED_HOSTS = [
        "webapp-573s.onrender.com",  # Dominio del backend su Render
        "animeratinghub.com",  # Dominio del frontend su Netlify
    ]

# Configurazione CORS
if ENVIRONMENT == 'development':
    CORS_ALLOWED_ORIGINS = [
        "http://127.0.0.1:3000",
        "http://localhost:3000",  # Frontend React locale
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "https://animeratinghub.com",
    ]

# Configurazione default auto field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

