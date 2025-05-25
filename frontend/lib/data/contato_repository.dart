import '../core/api_service.dart';

class ContatoRepository {
  final api = ApiService();

  Future<List<dynamic>> getContatos() async {
    final data = await api.getContatos();
    data.sort((a, b) {
      DateTime dataA = DateTime.tryParse(a['updatedAt'] ?? '') ?? DateTime(2000);
      DateTime dataB = DateTime.tryParse(b['updatedAt'] ?? '') ?? DateTime(2000);
      return dataB.compareTo(dataA);
    });
    return data;
  }

  Future<void> criar(Map<String, dynamic> data) async {
    await api.criarContato(data);
  }

  Future<void> atualizar(int id, Map<String, dynamic> data) async {
    await api.atualizarContato(id, data);
  }

  Future<void> deletar(int id) async {
    await api.deletarContato(id);
  }
}
