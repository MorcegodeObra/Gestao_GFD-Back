import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class GraficoPadrao extends StatelessWidget {
  final Map<String, int> dados;

  const GraficoPadrao({super.key, required this.dados});

  @override
  Widget build(BuildContext context) {
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
            Text("${entry.key}: $percentual%", style: const TextStyle(fontSize: 14)),
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
