import 'package:flutter/material.dart';
import '../../../core/API/api_controller.dart';

final ApiService repo = ApiService();

List<dynamic> processos = [];
List<dynamic> contatos = [];
Future<void> carregarProcessos() async {
  processos = await repo.processos.getProcessos();

  final prioridadeOrdem = {"URGENTE": 0, "ALTO": 1, "MÉDIO": 2, "BAIXO": 3};

  final processosOrdenados = [...processos];

  processosOrdenados.sort((a, b) {
    final prioridadeA = prioridadeOrdem[a['priority']] ?? 999;
    final prioridadeB = prioridadeOrdem[b['priority']] ?? 999;

    // 1. Compara pela prioridade
    if (prioridadeA != prioridadeB) {
      return prioridadeA.compareTo(prioridadeB);
    }

    // 2. Se prioridade for igual, compara por data
    final dateA = DateTime.tryParse(a['answerDate'] ?? '') ?? DateTime(1900);
    final dateB = DateTime.tryParse(b['answerDate'] ?? '') ?? DateTime(1900);
    return dateA.compareTo(dateB);
  });

  // se quiser sobrescrever a lista original:
  processos = processosOrdenados;
}

Future<void> carregarContatos() async {
  contatos = await repo.contatos.getContatos();
  contatos.sort(
    (a, b) => (a['name'] ?? '').toLowerCase().compareTo(
      (b['name'] ?? '').toLowerCase(),
    ),
  );
}

void deletarProcesso(int id) async {
  await repo.processos.deletarProcessos(id);
  carregarProcessos();
}

void aceitarEnvioProcesso(int id, Map<String, dynamic> data) async {
  await repo.processos.aceitarEnvioProcesso(id, data);
  carregarProcessos();
}

void criarProcesso(Map<String, dynamic> data) async {
  await repo.processos.criarProcessos(data);
  carregarProcessos();
}

void addEmail(int id, List<Map<String, dynamic>> data) async {
  await repo.contatos.adicionarEmail(id, data);
  carregarContatos();
}

class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
