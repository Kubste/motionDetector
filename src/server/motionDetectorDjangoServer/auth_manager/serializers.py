from django.contrib.auth import password_validation
from rest_framework import serializers, generics
from django.core.exceptions import ValidationError

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

class PasswordChangeSerializer(serializers.ModelSerializer):
    # extra only serializer fields that does not exist in User model
    old_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['old_password', 'new_password']

    def validate(self, attrs):
        user = self.context['request'].user

        # checking if given old password is correct
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError('Old password incorrect')

        # validating given new password
        try:
            password_validation.validate_password(attrs['new_password'])
        except ValidationError as exception:
            raise serializers.ValidationError(exception.messages)

        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance