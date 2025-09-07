from rest_framework import permissions

# returns true for admin
class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsSuperuser(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'sup'

class IsSuperuserOrAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'sup' or request.user.role == 'admin')

# returns true for admin and other users if they use safe methods
class AdminWritePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        return request.user.is_authenticated and (request.user.role == 'admin' or request.user.role == 'sup')
