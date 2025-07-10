import 'package:flutter/material.dart';
import '../widgets/app_graphic.dart';

class GraficoProcessosPage extends StatefulWidget {
  final int? userId;
  final List<dynamic> processos;
  final List<dynamic> contatos;
  final bool isLoading;

  const GraficoProcessosPage({super.key,
  required this.processos,
  required this.contatos,
  required this.userId,
  required this.isLoading,
  });

  @override
  State<GraficoProcessosPage> createState() => _GraficoProcessosPageState();
}

class _GraficoProcessosPageState extends State<GraficoProcessosPage> {
  int acima30Dias = 0;
  int abaixo30Dias = 0;

  Set<String> filtrosAtivosTrue = {};
  Set<String> filtrosAtivosFalse = {};

  Map<String, int> dadosTrue = {};
  Map<String, int> dadosFalse = {};
  bool filtrarPorUsuario = false;

  @override
  void initState() {
    super.initState();
  }

  Future<void> processarDados() async {
    final agora = DateTime.now();
    int acima = 0;
    int abaixo = 0;

    final dataFiltrada = widget.processos.where((processo) {
      if (filtrarPorUsuario) {
        return processo['userId'] == widget.userId;
      }
      return true;
    }).toList();

    for (var processo in dataFiltrada) {
      final last = processo['lastInteration'];
      if (last != null) {
        final lastDate = DateTime.tryParse(last.toString());
        if (lastDate != null) {
          final diff = agora.difference(lastDate).inDays;
          if (diff >= 30) {
            acima++;
          } else {
            abaixo++;
          }
        }
      }
    }

    final processosTrue = dataFiltrada
        .where((c) => c['answer'] == true && c['lastInteration'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final processosFalse = dataFiltrada
        .where((c) => c['answer'] == false && c['lastInteration'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    final dadosT = agruparPorStatus(processosTrue);
    final dadosF = agruparPorStatus(processosFalse);

    setState(() {
      acima30Dias = acima;
      abaixo30Dias = abaixo;
      dadosTrue = dadosT;
      dadosFalse = dadosF;
      filtrosAtivosTrue = dadosT.keys.toSet();
      filtrosAtivosFalse = dadosF.keys.toSet();
    });
  }


  Map<String, int> agruparPorStatus(List<Map<String, dynamic>> lista) {
    final Map<String, int> resultado = {};
    for (var processo in lista) {
      final status = processo['contatoStatus'] ?? 'Sem status';
      resultado[status] = (resultado[status] ?? 0) + 1;
    }
    return resultado;
  }

  void toggleFiltroTrue(String categoria) {
    setState(() {
      if (!filtrosAtivosTrue.remove(categoria)) {
        filtrosAtivosTrue.add(categoria);
      }
    });
  }

  void toggleFiltroFalse(String categoria) {
    setState(() {
      if (!filtrosAtivosFalse.remove(categoria)) {
        filtrosAtivosFalse.add(categoria);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: processarDados,
              child: SafeArea(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Mostrar somente meus processos',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Switch(
                          value: filtrarPorUsuario,
                          onChanged: (value) {
                            setState(() {
                              filtrarPorUsuario = value;
                            });
                            processarDados();
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Gráfico Respondidos
                    const Text(
                      'Respondidos',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    GraficoPadrao(
                      dadosOriginais: dadosTrue,
                      filtrosAtivos: filtrosAtivosTrue,
                      toggleFiltro: toggleFiltroTrue,
                    ),

                    const SizedBox(height: 8),

                    // Gráfico Sem resposta
                    const Text(
                      'Sem resposta',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    GraficoPadrao(
                      dadosOriginais: dadosFalse,
                      filtrosAtivos: filtrosAtivosFalse,
                      toggleFiltro: toggleFiltroFalse,
                    ),

                    const SizedBox(height: 10),

                    // Texto de resumo
                    Text(
                      '$acima30Dias processos com mais de 30 dias\n'
                      '$abaixo30Dias processos dentro do prazo',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
