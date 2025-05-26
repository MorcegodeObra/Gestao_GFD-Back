import 'package:dio/dio.dart';

class ApiService {
  final Dio dio = Dio(BaseOptions(baseUrl: 'https://chatbotwhatsapp-z0bc.onrender.com'));

  // CONTATOS
Future<List<dynamic>> getContatos({int? userId}) async {
  final response = await dio.get(
    '/contatos',
    queryParameters: userId != null ? {'userId': userId} : null,
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

  // USUÁRIO
  Future<void> criarUsuario(Map<String, dynamic> data) async {
    await dio.post('/users', data: data); // 🔥 Corrigido: era '/user'
  }

  Future<void> atualizarUsuario(int id, Map<String, dynamic> data) async {
    await dio.put('/users/$id', data: data); // 🔥 Corrigido: era '/user'
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> data) async {
    final response = await dio.post('/login', data: data);
    return response.data;
  }
}
