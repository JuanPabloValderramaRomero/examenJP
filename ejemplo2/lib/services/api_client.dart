import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_config.dart';

class ApiException implements Exception {
  final int? statusCode;
  final String message;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() =>
      statusCode == null ? message : '$message (code $statusCode)';
}

class ApiClient {
  final http.Client _client;

  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  void close() => _client.close();

  Uri _uri(String path) {
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return Uri.parse('${ApiConfig.baseUrl}$normalizedPath');
  }

  Future<dynamic> getJson(String path) async {
    final response = await _client.get(_uri(path));
    return _decodeResponse(response);
  }

  Future<dynamic> postJson(String path, Map<String, dynamic> body) async {
    final response = await _client.post(
      _uri(path),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );
    return _decodeResponse(response);
  }

  dynamic _decodeResponse(http.Response response) {
    final raw = response.body;
    dynamic parsed;

    if (raw.isNotEmpty) {
      try {
        parsed = jsonDecode(raw);
      } catch (_) {
        parsed = raw;
      }
    }

    final ok = response.statusCode >= 200 && response.statusCode < 300;
    if (ok) return parsed;

    String message = 'Error en la API';
    if (parsed is Map) {
      if (parsed['message'] != null) message = parsed['message'].toString();
      if (parsed['error'] != null) message = parsed['error'].toString();
    } else if (parsed is String && parsed.trim().isNotEmpty) {
      message = parsed.trim();
    }

    throw ApiException(message, statusCode: response.statusCode);
  }
}

