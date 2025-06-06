import 'package:flutter/material.dart';
import '../widgets/app_graphic.dart';
import '../../core/API/api_controller.dart';
import '../../core/UTILS/salvar_dados.dart';
import '../widgets/app_drawer.dart';

class GraficoProcessosPage extends StatefulWidget {
  const GraficoProcessosPage({super.key});

  @override
  State<GraficoProcessosPage> createState() => _GraficoProcessosPageState();
}

class _GraficoProcessosPageState extends State<GraficoProcessosPage> {
  final repo = ApiService();
  bool isLoading = true;
  List<dynamic> processoss = [];
  int? userId;
  int acima30Dias = 0;
  int abaixo30Dias = 0;

  @override
  void initState() {
    super.initState();
    carregarUserEDados();
  }

  Future<void> carregarUserEDados() async {
    final userData = await getDadosUsuario();
    setState(() {
      userId = userData['userId'];
    });

    if (userId != null) {
      try {
        final data = await repo.processos.getProcessos(userId: userId!);
        final agora = DateTime.now();

        for (var processos in data) {
          final last = processos['lastInteration'];
          if (last != null) {
            final lastDate = DateTime.tryParse(last.toString());
            if (lastDate != null) {
              final diff = agora.difference(lastDate).inDays;
              if (diff >= 30) {
                acima30Dias++;
              } else {
                abaixo30Dias++;
              }
            }
          }
        }
        setState(() {
          processoss = data;
          acima30Dias = acima30Dias;
          abaixo30Dias = abaixo30Dias;
        });
      } catch (e) {
        debugPrint('Erro ao carregar Processoss: $e');
      } finally {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Map<String, int> agruparPorStatus(List<Map<String, dynamic>> lista) {
    final Map<String, int> resultado = {};
    for (var processos in lista) {
      final status = processos['ProcessosStatus'] ?? 'Sem status';
      resultado[status] = (resultado[status] ?? 0) + 1;
    }
    return resultado;
  }

  @override
  Widget build(BuildContext context) {
    final processossTrue = processoss
        .where((c) => c['answer'] == true && c['contatoStatus'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final processossFalse = processoss
        .where((c) => c['answer'] == false && c['contatoStatus'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final dadosTrue = agruparPorStatus(processossTrue);
    final dadosFalse = agruparPorStatus(processossFalse);

    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text('Analise de processos'),
        automaticallyImplyLeading: true,
        actions: [
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text(
                    'Respondidos',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Expanded(child: GraficoPadrao(dados: dadosTrue)),
                  const Text(
                    'Sem resposta',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Expanded(child: GraficoPadrao(dados: dadosFalse)),
                  Text(
                    '$acima30Dias processos com mais de 30 dias',
                    style: TextStyle(fontSize: 14),
                  ),
                  Text(
                    '$abaixo30Dias processos dentro do prazo',
                    style: TextStyle(fontSize: 14),
                  ),
                ],
              ),
            ),
    );
  }
}
