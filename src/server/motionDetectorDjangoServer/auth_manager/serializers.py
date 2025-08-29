from rest_framework import serializers, generics
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)     # prevent sending hashed password in response

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'role', 'username']
        
    def create(self, validated_data):
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number'],
            email=validated_data['email'],
            role=validated_data.get('role', 'user'),    # default 'user' role
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])   # hash the password
        user.save()
        return user
