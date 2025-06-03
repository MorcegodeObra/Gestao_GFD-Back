import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../data/contato_repository.dart';
import '../../data/salvar_dados.dart';
import '../../core/delete_dialog.dart';

class GraficoContatosPage extends StatefulWidget {
  const GraficoContatosPage({super.key});

  @override
  State<GraficoContatosPage> createState() => _GraficoContatosPageState();
}

class _GraficoContatosPageState extends State<GraficoContatosPage> {
  final repo = ContatoRepository();
  bool isLoading = true;
  List<dynamic> contatos = [];
  int? userId;

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
        final data = await repo.getContatos(userId: userId!);
        setState(() {
          contatos = data;
        });
      } catch (e) {
        debugPrint('Erro ao carregar contatos: $e');
      } finally {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Map<String, int> agruparPorStatus(List<Map<String, dynamic>> lista) {
    final Map<String, int> resultado = {};
    for (var contato in lista) {
      final status = contato['contatoStatus'] ?? 'Sem status';
      resultado[status] = (resultado[status] ?? 0) + 1;
    }
    return resultado;
  }

  @override
  Widget build(BuildContext context) {
    final contatosTrue = contatos
        .where((c) => c['answer'] == true && c['lastInteration'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final contatosFalse = contatos
        .where((c) => c['answer'] == false && c['lastInteration'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final dadosTrue = agruparPorStatus(contatosTrue);
    final dadosFalse = agruparPorStatus(contatosFalse);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analise de processos'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => ConfirmDeleteDialog(
                  titulo: 'Confirmar Logout',
                  mensagem: 'Deseja realmente sair?',
                  onConfirm: () async {
                    await logout();
                    Navigator.pushReplacementNamed(context, '/');
                  },
                ),
              );
            },
          ),
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
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Expanded(child: buildPieChart(dadosTrue)),
                  const SizedBox(height: 12),
                  const Text(
                    'Sem resposta',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Expanded(child: buildPieChart(dadosFalse)),
                ],
              ),
            ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(12),
        child: ElevatedButton.icon(
          onPressed: () async {
            await Navigator.pushNamed(context, '/meusProcessos');
          },
          icon: const Icon(Icons.folder_copy),
          label: const Text('Acessar Meus Processos'),
        ),
      ),
    );
  }

  Widget buildPieChart(Map<String, int> dados) {
    if (dados.isEmpty) {
      return const Center(child: Text("Sem dados para exibir"));
    }

    final List<Color> cores = [
      Colors.blue,
      Colors.green,
      Colors.orange,
      Colors.purple,
      Colors.red,
      Colors.teal,
      Colors.brown,
      Colors.cyan,
    ];

    final total = dados.values.fold<int>(0, (sum, value) => sum + value);

    int index = 0;

    final sections = dados.entries.map((entry) {
      final cor = cores[index % cores.length];
      final section = PieChartSectionData(
        color: cor,
        value: entry.value.toDouble(),
        title: "${entry.key}\n${entry.value}", // Mostra a quantidade
        radius: 80,
        titleStyle: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.black, // Texto preto
        ),
      );
      index++;
      return section;
    }).toList();

    // Resetar índice para montar legenda
    index = 0;

    final legendas = dados.entries.map((entry) {
      final cor = cores[index % cores.length];
      final percentual = (entry.value / total * 100).toStringAsFixed(1);
      index++;
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(color: cor, shape: BoxShape.circle),
            ),
            Text(
              "${entry.key}: $percentual%",
              style: const TextStyle(fontSize: 14),
            ),
          ],
        ),
      );
    }).toList();

    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PieChart(
            PieChartData(
              sections: sections,
              sectionsSpace: 2,
              centerSpaceRadius: 30,
            ),
          ),
        ),
        const SizedBox(height: 12),
        ...legendas,
      ],
    );
  }
}
