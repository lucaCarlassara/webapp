far partire il backend:
- entrare cartella backend
- Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
- .\env\Scripts\Activate
- python manage.py runserver

far partire il frontend
- entrare cartella frontend
- npm start

quando si cambia il database dal backend fare:
- python manage.py makemigrations
- python manage.py migrate

per aggiungere anime
- http://127.0.0.1:8000/admin/

installare la roba
- creare un ambiente virtuale per il backend
-- entrare in anime_rating_backend
-- python -m venv venv
-- venv\Scripts\activate
-- pip install -r requirements.txt
-- cecklist "far partire il backend"
-- se in qualsiasi momento ti da robe che non riesci a capire che cazzo è fai: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
- per il frontend non mi ricordo come ho fatto, forse uguale boh
