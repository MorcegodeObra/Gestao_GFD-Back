import 'package:flutter/material.dart';
import '../widgets/app_graphic.dart'; // GraficoPadrao agora tem o filtro interno
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

  Set<String> filtrosAtivosTrue = {};
  Set<String> filtrosAtivosFalse = {};

  Map<String, int> dadosTrue = {};
  Map<String, int> dadosFalse = {};
  bool filtrarPorUsuario = false;

  @override
  void initState() {
    super.initState();
    carregarUserEDados();
  }

  void processarDados() {
    final agora = DateTime.now();
    int acima = 0;
    int abaixo = 0;

    final dataFiltrada = processoss.where((processo) {
      if (filtrarPorUsuario) {
        return processo['userId'] == userId;
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

  Future<void> carregarUserEDados() async {
    final userData = await getDadosUsuario();
    setState(() {
      userId = userData['userId'];
    });

    if (userId != null) {
      try {
        final data = await repo.processos.getProcessos();

        setState(() {
          processoss = data; // salva todos os processos brutos
        });

        processarDados(); // aplica o filtro (inicialmente sem filtrar por user)
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
      drawer: const AppDrawer(),
      appBar: AppBar(title: const Text('Análise de processos')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SwitchListTile(
                      title: Text("Mostrar somente meus processos"),
                      value: filtrarPorUsuario,
                      onChanged: (value) {
                        setState(() {
                          filtrarPorUsuario = value;
                        });
                        processarDados();
                      },
                    ),
                    // Gráfico Respondidos
                    const Text(
                      'Respondidos',
                      style: TextStyle(
                        fontSize: 14,
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
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    GraficoPadrao(
                      dadosOriginais: dadosFalse,
                      filtrosAtivos: filtrosAtivosFalse,
                      toggleFiltro: toggleFiltroFalse,
                    ),

                    const SizedBox(height: 8),

                    // Texto de resumo
                    Text(
                      '$acima30Dias processos com mais de 30 dias\n'
                      '$abaixo30Dias processos dentro do prazo',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
