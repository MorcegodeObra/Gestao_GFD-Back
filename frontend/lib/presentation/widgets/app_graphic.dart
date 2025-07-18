import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class GraficoPadrao extends StatelessWidget {
  final List<dynamic> processos;
  final Map<String, int> dadosOriginais;
  final Set<String> filtrosAtivos;
  final Set<int> filtrosContatoAtivos;
  final List<dynamic> listaContatos;

  const GraficoPadrao({
    super.key,
    required this.processos,
    required this.dadosOriginais,
    required this.filtrosAtivos,
    required this.filtrosContatoAtivos,
    required this.listaContatos,
  });

  Map<String, int> gerarDadosFiltrados() {
    final filtrados = processos.where((item) {
      final p = item as Map<String, dynamic>;
      final status = p['contatoStatus'] ?? 'Sem status';
      final rawContatoId = p['contatoId'];

      // Converte contatoId para int com segurança
      final contatoId = rawContatoId is int
          ? rawContatoId
          : int.tryParse(rawContatoId.toString());

      final statusMatch =
          filtrosAtivos.isEmpty || filtrosAtivos.contains(status);
      final contatoMatch =
          filtrosContatoAtivos.isEmpty ||
          (contatoId != null && filtrosContatoAtivos.contains(contatoId));

      return statusMatch && contatoMatch;
    });

    final resultado = <String, int>{};
    for (var item in filtrados) {
      final p = item as Map<String, dynamic>;
      final status = p['contatoStatus'] ?? 'Sem status';
      resultado[status] = (resultado[status] ?? 0) + 1;
    }
    return resultado;
  }

  @override
  Widget build(BuildContext context) {
    final dados = gerarDadosFiltrados();

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
      index++;
      return PieChartSectionData(
        color: cor,
        value: entry.value.toDouble(),
        title: "${entry.value}",
        radius: 60,
        titleStyle: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
      );
    }).toList();

    // Legenda
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
              width: 10,
              height: 10,
              margin: const EdgeInsets.only(right: 8),
              decoration: BoxDecoration(color: cor, shape: BoxShape.circle),
            ),
            Text(
              "${entry.key}: $percentual%",
              style: const TextStyle(fontSize: 12),
            ),
          ],
        ),
      );
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Align(
          alignment: Alignment.centerLeft,
          child: PopupMenuButton<String>(
            offset: const Offset(0, 40),
            itemBuilder: (BuildContext context) {
              return dadosOriginais.keys.map((String categoria) {
                final selecionado = filtrosAtivos.contains(categoria);
                return CheckedPopupMenuItem<String>(
                  value: categoria,
                  checked: selecionado,
                  child: Text(categoria),
                );
              }).toList();
            },
            child: Padding(padding: const EdgeInsets.only(bottom: 8)),
          ),
        ),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 180,
                height: 180,
                child: PieChart(
                  PieChartData(
                    sections: sections,
                    sectionsSpace: 2,
                    centerSpaceRadius: 30,
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: legendas,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
