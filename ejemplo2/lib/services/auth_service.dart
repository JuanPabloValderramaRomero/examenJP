import 'api_client.dart';

class LoginResult {
  final String userDisplay;
  final String role;
  final String? token;

  const LoginResult({required this.userDisplay, required this.role, this.token});
}

class AuthService {
  final ApiClient _api;

  AuthService(this._api);

  Future<void> register({
    required String email,
    required String password,
    required String roleName,
  }) async {
    await _api.postJson('/auth/register', {
      'email': email,
      'password': password,
      'rol': roleName,
    });
  }

  Future<LoginResult> login({
    required String usernameOrEmail,
    required String password,
  }) async {
    final body = usernameOrEmail.contains('@')
        ? {'email': usernameOrEmail, 'password': password}
        : {'username': usernameOrEmail, 'password': password};

    final parsed = await _api.postJson('/auth/login', body);

    var userDisplay = usernameOrEmail;
    var role = 'Usuario';
    String? token;

    if (parsed is Map) {
      final user = parsed['user'];
      if (user is Map) {
        if (user['user'] != null) userDisplay = user['user'].toString();
        if (user['role'] != null) role = user['role'].toString();
      } else {
        if (parsed['role'] != null) role = parsed['role'].toString();
      }

      if (parsed['token'] != null) token = parsed['token'].toString();
    }

    return LoginResult(userDisplay: userDisplay, role: role, token: token);
  }
}

