import 'package:flutter/material.dart';
import '../../../core/API/api_controller.dart';

final ApiService repo = ApiService();

List<dynamic> processos = [];
List<dynamic> contatos = [];
Future<void> carregarProcessos() async {
  contatos = await repo.processos.getProcessos();
}

Future<void> carregarContatos() async {
  contatos = await repo.contatos.getContatos();
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

void criarContato(Map<String, dynamic> data) async {
  await repo.contatos.criarContatos(data);
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