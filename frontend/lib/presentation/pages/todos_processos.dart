import 'package:flutter/material.dart';
import 'package:frontend/presentation/widgets/processo_card.dart';

class TodosProcessos extends StatefulWidget {
  final int? userId;
  final List<dynamic> processos;
  final List<dynamic> contatos;
  final Future<void> Function(int, Map<String, dynamic>) atualizarProcessos;
  final VoidCallback carregarDados;
  final bool isLoading;

  const TodosProcessos({
    super.key,
    required this.userId,
    required this.processos,
    required this.contatos,
    required this.atualizarProcessos,
    required this.carregarDados,
    required this.isLoading,
  });

  @override
  State<TodosProcessos> createState() => _TodosProcessosState();
}

class _TodosProcessosState extends State<TodosProcessos> {
  String? statusSelecionado;
  bool? respondidoSelecionado;

  final TextEditingController _searchController = TextEditingController();
  String termoBusca = '';

  Widget _buildFiltroRespondidoButton() {
    final bool isRespondido = respondidoSelecionado == true;

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isRespondido ? Colors.blue : Colors.orange,
        foregroundColor: Colors.white,
        textStyle: const TextStyle(fontSize: 12),
      ),
      onPressed: () {
        setState(() {
          respondidoSelecionado = !isRespondido;
        });
      },
      child: Text(isRespondido ? "Respondidos" : "Não Respondidos"),
    );
  }

  Widget _buildFiltroButton(String? status, String label) {
    final isSelected = statusSelecionado == status;

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? Colors.green : Colors.grey[300],
        foregroundColor: isSelected ? Colors.white : Colors.black,
        textStyle: const TextStyle(fontSize: 12),
      ),
      onPressed: () {
        setState(() {
          if (isSelected) {
            statusSelecionado = null;
          } else {
            statusSelecionado = status;
          }
        });
      },
      child: Text(label),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Map<int, String> mapaContatos = {
      for (var contato in widget.contatos)
        contato["id"] as int: (contato['name'] ?? "Desconhecido").toString(),
    };

    final processosFiltrados = widget.processos.where((p) {
      final status = p['contatoStatus'];
      final processo = p['processoSider']?.toString().toLowerCase() ?? '';
      final idUsuario = p['userId'];

      final matchesBusca = processo.contains(termoBusca);
      final matchesStatus =
          statusSelecionado == null || status == statusSelecionado;
      final isFromOtherUser = idUsuario != widget.userId;
      final respondidoOk =
          (respondidoSelecionado == true && p['answer'] == true) ||
          (respondidoSelecionado == false && p['answer'] == false);

      return matchesBusca && matchesStatus && isFromOtherUser && respondidoOk;
    }).toList();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: widget.isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      labelText: "Buscar por processo",
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {
                        termoBusca = value.toLowerCase();
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _buildFiltroRespondidoButton(),
                      _buildFiltroButton("REVISÃO DE PROJETO", "Revisão"),
                      _buildFiltroButton("IMPLANTAÇÃO", "Implantação"),
                      _buildFiltroButton("ASSINATURAS", "Assinatura"),
                      _buildFiltroButton("VISTORIA INICIAL", "Vistoria I"),
                      _buildFiltroButton("VISTORIA FINAL", "Vistoria F"),
                      _buildFiltroButton(
                        "CANCELADO/ARQUIVADO",
                        "Cancelado/Arquivo",
                      ),
                    ],
                  ),
                  Expanded(
                    child: processosFiltrados.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(
                                  Icons.folder_off,
                                  size: 64,
                                  color: Colors.grey,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  "Nenhum processo encontrado!",
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : Column(
                            children: [
                              Expanded(
                                child: ListView(
                                  children: processosFiltrados.map((processos) {
                                    final contatoId = processos['contatoId'];
                                    final nomeContato =
                                        mapaContatos[contatoId] ??
                                        "Desconhecido";
                                    final bool processoDoUsuario =
                                        processos['userId'] == widget.userId;
                                    final bool processoAguardando =
                                        processos["solicitacaoProcesso"] ==
                                        true;

                                    return ProcessoCard(
                                      processo: processos,
                                      contato: nomeContato,
                                      editIcon: processoAguardando
                                          ? Icons.watch_later
                                          : (!processoDoUsuario
                                                ? Icons.work
                                                : Icons.check_circle),
                                      onEdit: !processoDoUsuario
                                          ? () async {
                                              try {
                                                final dataAtualizada =
                                                    Map<String, dynamic>.from(
                                                      processos,
                                                    );
                                                dataAtualizada["userId"] =
                                                    widget.userId;
                                                await widget.atualizarProcessos(
                                                  processos["id"],
                                                  dataAtualizada,
                                                );
                                                setState(() {});
                                                showDialog(
                                                  context: context,
                                                  builder: (context) => AlertDialog(
                                                    title: const Text(
                                                      'Sucesso',
                                                    ),
                                                    content: Text(
                                                      "Processo foi para sua carga!",
                                                    ),
                                                    actions: [
                                                      TextButton(
                                                        onPressed: () =>
                                                            Navigator.pop(
                                                              context,
                                                            ),
                                                        child: const Text('OK'),
                                                      ),
                                                    ],
                                                  ),
                                                );
                                              } catch (e) {
                                                showDialog(
                                                  context: context,
                                                  builder: (context) => AlertDialog(
                                                    title: const Text(
                                                      'Erro ao puxar o processo',
                                                    ),
                                                    content: Text(e.toString()),
                                                    actions: [
                                                      TextButton(
                                                        onPressed: () =>
                                                            Navigator.of(
                                                              context,
                                                            ).pop(),
                                                        child: const Text('OK'),
                                                      ),
                                                    ],
                                                  ),
                                                );
                                              }
                                            }
                                          : null,
                                    );
                                  }).toList(),
                                ),
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
