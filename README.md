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
