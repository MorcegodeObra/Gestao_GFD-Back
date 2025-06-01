import 'package:dio/dio.dart';

class ApiService {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://chatbotwhatsapp-z0bc.onrender.com',
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
    ),
  );

  Future<List<dynamic>> getContatos({int? userId, int? notUserId}) async {
    final Map<String, dynamic> queryParams = {};

    if (userId != null) {
      queryParams['userId'] = userId;
    }
    if (notUserId != null) {
      queryParams['notUserId'] = notUserId;
    }

    final response = await dio.get(
      '/contatos',
      queryParameters: queryParams.isNotEmpty ? queryParams : null,
    );

    return response.data;
  }

  Future<void> criarContato(Map<String, dynamic> data) async {
    await dio.post('/contatos', data: data);
  }

  Future<void> atualizarContato(int id, Map<String, dynamic> data) async {
    await dio.put('/contatos/$id', data: data);
  }

  Future<void> deletarContato(int id) async {
    await dio.delete('/contatos/$id');
  }

  Future<void> criarUsuario(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/users', data: data);
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(e.response?.data['message'] ?? 'Erro ao criar usuário');
      } else {
        throw Exception('Erro de conexão: ${e.message}');
      }
    } catch (e) {
throw Exception('Erro inesperado: $e');
    }
  }

  Future<void> atualizarUsuario(int id, Map<String, dynamic> data) async {
    await dio.put('/users/$id', data: data);
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> data) async {
    final response = await dio.post('/login', data: data);
    return response.data;
  }
}
