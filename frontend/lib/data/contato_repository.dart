import '../core/api_service.dart';

class ContatoRepository {
  final api = ApiService();

  Future<List<dynamic>> getContatos({int? userId}) {
    return api.getContatos(userId: userId);
  }

  Future<void> criar(Map<String, dynamic> data) {
    return api.criarContato(data);
  }

  Future<void> atualizar(int id, Map<String, dynamic> data) {
    return api.atualizarContato(id, data);
  }

  Future<void> deletar(int id) {
    return api.deletarContato(id);
  }
}
