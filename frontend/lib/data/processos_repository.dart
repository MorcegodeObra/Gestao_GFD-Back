import '../core/api_service.dart';

class ProcessosRepository {
  final api = ApiService();

  Future<List<dynamic>> getProcessos({int? userId, int? notUserId}) {
    return api.getProcessos(userId: userId, notUserId: notUserId);
  }

  Future<void> criar(Map<String, dynamic> data) {
    return api.criarProcessos(data);
  }

  Future<void> atualizar(int id, Map<String, dynamic> data) {
    return api.atualizarProcessos(id, data);
  }

  Future<void> deletar(int id) {
    return api.deletarProcessos(id);
  }
}
