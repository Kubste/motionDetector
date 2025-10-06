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
        role = validated_data.get('role', 'user')       # default 'user' role if not provided

        if role in ['sup', 'admin']:
            is_staff = True
        else:
            is_staff = False

        if role == 'sup':
            is_superuser = True
        else:
            is_superuser = False

        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number'],
            email=validated_data['email'],
            role=role,
            username=validated_data['username'],
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        user.set_password(validated_data['password'])   # hash the password
        user.save()
        return user

    def validate(self, attrs):
        role = self.context['request'].user.role

        if role not in ['sup', 'admin']:
            raise ValidationError('Only superadmin and administrator can register users')

        if role == 'admin' and attrs['role'] != 'user':
            raise ValidationError('Administrator can only register users')

        return attrs

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

class UsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'role']
        read_only_fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'role']

    def validate(self, attrs):
        user = self.context['request'].user

        if user.role not in ['sup', 'admin']:
            raise ValidationError('Only superadmin and administrator can fetch users')

class AuthManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'role']
        read_only_fields = ['role']