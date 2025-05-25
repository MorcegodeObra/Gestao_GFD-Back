import 'package:dio/dio.dart';

class ApiService {
  final Dio dio = Dio(BaseOptions(baseUrl: 'https://chatbotwhatsapp-z0bc.onrender.com'));

  // CONTATOS
  Future<List<dynamic>> getContatos() async {
    final response = await dio.get('/contatos');
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

  // USUÁRIO (somente POST e PUT)
  Future<void> criarUsuario(Map<String, dynamic> data) async {
    await dio.post('/user', data: data);
  }

  Future<void> atualizarUsuario(int id, Map<String, dynamic> data) async {
    await dio.put('/user/$id', data: data);
  }
}
