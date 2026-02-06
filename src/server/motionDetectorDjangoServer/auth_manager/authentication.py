from knox.auth import TokenAuthentication

# checking for token in cookies instead of in request body
class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('knox')
        if not token:
            return None

        if isinstance(token, str):
            token = token.encode('utf-8')
        return self.authenticate_credentials(token)