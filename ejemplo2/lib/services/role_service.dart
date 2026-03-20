import '../models/role.dart';
import 'api_client.dart';

class RoleService {
  final ApiClient _api;

  RoleService(this._api);

  Future<List<Role>> getRoles() async {
    final parsed = await _api.getJson('/api_v1/role');
    if (parsed is List) {
      return parsed
          .where((e) => e is Map)
          .map((e) => Role.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
    }
    throw ApiException('Respuesta inesperada al listar roles');
  }

  Future<void> createRole({
    required String name,
    required String description,
  }) async {
    await _api.postJson('/api_v1/role', {
      'name': name,
      'description': description,
    });
  }
}

