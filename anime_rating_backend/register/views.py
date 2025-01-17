from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view

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
        return Response({'error': str(e)}, status=400)

