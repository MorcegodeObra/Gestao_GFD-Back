import 'package:flutter/material.dart';
import '../widgets/app_graphic.dart';

class GraficoProcessosPage extends StatefulWidget {
  final int? userId;
  final List<dynamic> processos;
  final List<dynamic> contatos;
  final bool isLoading;

  const GraficoProcessosPage({
    super.key,
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

  Set<String> filtrosProcessosAtivos = {};
  Set<int> filtrosContatosAtivos = {};

  List<Map<String, dynamic>> processosTrue = [];
  List<Map<String, dynamic>> processosFalse = [];

  Map<String, int> dadosTrue = {};
  Map<String, int> dadosFalse = {};

  bool filtrarPorUsuario = false;

  @override
  void initState() {
    processarDados();
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

    processosTrue = dataFiltrada
        .where((c) => c['answer'] == true && c['lastInteration'] != null)
        .cast<Map<String, dynamic>>()
        .toList();

    processosFalse = dataFiltrada
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
      filtrosProcessosAtivos = {...dadosT.keys, ...dadosF.keys};
      this.processosTrue = processosTrue;
      this.processosFalse = processosFalse;
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

  void toggleFiltroProcessos(String categoria) {
    setState(() {
      if (filtrosProcessosAtivos.contains(categoria)) {
        filtrosProcessosAtivos.remove(categoria);
      } else {
        filtrosProcessosAtivos.add(categoria);
      }
    });
  }

  void toggleFiltroContato(int contatoId) {
    setState(() {
      if (filtrosContatosAtivos.contains(contatoId)) {
        filtrosContatosAtivos.remove(contatoId);
      } else {
        filtrosContatosAtivos.add(contatoId);
      }
    });
  }

  void _mostrarFiltroStatus(BuildContext context) {
    final todosStatus = {...dadosFalse.keys, ...dadosTrue.keys};
    final Set<String> selecionados = Set.from(filtrosProcessosAtivos);

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Filtrar por status"),
          content: SizedBox(
            width: double.maxFinite,
            child: StatefulBuilder(
              builder: (context, setInnerState) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      width: double.maxFinite,
                      child: ListView(
                        shrinkWrap: true,
                        children: todosStatus.map((status) {
                          return CheckboxListTile(
                            title: Text(status),
                            value: selecionados.contains(status),
                            onChanged: (value) {
                              setInnerState(() {
                                if (value == true) {
                                  selecionados.add(status);
                                } else {
                                  selecionados.remove(status);
                                }
                              });
                            },
                          );
                        }).toList(),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          filtrosProcessosAtivos = selecionados;
                        });
                        Navigator.of(context).pop();
                      },
                      child: const Text("Aplicar filtros"),
                    ),
                  ],
                );
              },
            ),
          ),
        );
      },
    );
  }

  void _mostrarFiltroContatos(BuildContext context) {
    final todosContatos = widget.contatos;
    final Set<String> selecionados = Set.from(filtrosProcessosAtivos);

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Filtrar por contato"),
          content: SizedBox(
            width: double.maxFinite,
            child: StatefulBuilder(
              builder: (context, setInnerState) {
                return SizedBox(
                  height:
                      MediaQuery.of(context).size.height *
                      0.5, // controla altura
                  child: Column(
                    children: [
                      Expanded(
                        // <- permite que a lista role
                        child: ListView(
                          children: todosContatos.map((contato) {
                            final nome = contato['name']; // ou contato['name']
                            return CheckboxListTile(
                              title: Text(nome),
                              value: selecionados.contains(nome),
                              onChanged: (value) {
                                setInnerState(() {
                                  if (value == true) {
                                    selecionados.add(nome);
                                  } else {
                                    selecionados.remove(nome);
                                  }
                                });
                              },
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            filtrosProcessosAtivos = selecionados;
                          });
                          Navigator.of(context).pop();
                        },
                        child: const Text("Aplicar filtros"),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.isLoading
          ? const Center(child: CircularProgressIndicator())
          : SafeArea(
              child: Column(
                children: [
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => _mostrarFiltroStatus(context),
                        label: const Text("Filtrar por status"),
                        icon: const Icon(Icons.filter_alt),
                      ),
                      ElevatedButton.icon(
                        onPressed: () => _mostrarFiltroContatos(context),
                        label: const Text("Filtrar por contato"),
                        icon: const Icon(Icons.person),
                      ),
                    ],
                  ),
                  Expanded(
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
                        const Text(
                          'Respondidos',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        GraficoPadrao(
                          dadosOriginais: dadosTrue,
                          filtrosAtivos: filtrosProcessosAtivos,
                          filtrosContatoAtivos: filtrosContatosAtivos,
                          listaContatos: widget.contatos,
                          processos: processosTrue,
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Sem resposta',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        GraficoPadrao(
                          dadosOriginais: dadosFalse,
                          filtrosAtivos: filtrosProcessosAtivos,
                          filtrosContatoAtivos: filtrosContatosAtivos,
                          listaContatos: widget.contatos,
                          processos: processosFalse,
                        ),
                        const SizedBox(height: 10),
                        Text(
                          '$acima30Dias processos com mais de 30 dias\n'
                          '$abaixo30Dias processos dentro do prazo',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
