import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class GraficoPadrao extends StatelessWidget {
  final Map<String, int> dadosOriginais;
  final Set<String> filtrosAtivos;
  final void Function(String) toggleFiltro;

  const GraficoPadrao({
    super.key,
    required this.dadosOriginais,
    required this.filtrosAtivos,
    required this.toggleFiltro,
  });

  Map<String, int> filtrarDados() {
    if (filtrosAtivos.isEmpty) return dadosOriginais;
    return Map.fromEntries(
      dadosOriginais.entries.where(
        (entry) => filtrosAtivos.contains(entry.key),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dados = filtrarDados();

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
        radius: 80,
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
            onSelected: toggleFiltro,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: const [
                  Icon(Icons.filter_list, size: 18),
                  SizedBox(width: 4),
                  Text(
                    "Filtrar",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Icon(Icons.arrow_drop_down),
                ],
              ),
            ),
          ),
        ),
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
