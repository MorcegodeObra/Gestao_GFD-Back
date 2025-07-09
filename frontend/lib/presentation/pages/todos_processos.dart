import 'package:flutter/material.dart';
import 'package:frontend/presentation/widgets/processo_card.dart';
import '../../core/API/api_controller.dart';
import '../../core/UTILS/salvar_dados.dart';

class TodosProcessos extends StatefulWidget {
  const TodosProcessos({super.key});

  @override
  State<TodosProcessos> createState() => _TodosProcessosState();
}

class _TodosProcessosState extends State<TodosProcessos> {
  final repo = ApiService();
  List<dynamic> processos = [];
  List<dynamic> contatos = [];
  int? userId;
  bool isLoading = true;
  String? statusSelecionado;
  final TextEditingController _searchController = TextEditingController();
  String termoBusca = '';

  @override
  void initState() {
    super.initState();
    carregarDadosUsuario();
  }

  Future<void> carregarDadosUsuario() async {
    final userData = await getDadosUsuario();
    setState(() {
      userId = userData['userId'];
    });
    await carregarContatos();
    await carregarProcessoss();
  }

  Future<void> carregarContatos() async {
    try {
      final data = await repo.contatos.getContatos();
      setState(() {
        contatos = data;
      });
    } catch (e) {
      debugPrint('Erro ao carregar contatos: $e');
    }
  }

  Future<void> carregarProcessoss() async {
    if (userId == null) return;
    setState(() {
      isLoading = true;
    });

    try {
      final data = await repo.processos.getProcessos();
      final processosFiltrados = data
          .where((p) => p['userId'] != userId)
          .toList();

      setState(() {
        processos = processosFiltrados;
      });
    } catch (e) {
      debugPrint('Erro ao carregar Processoss: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> deletarProcessos(int id) async {
    await repo.processos.deletarProcessos(id);
    carregarProcessoss();
  }

  Widget _buildFiltroButton(String? status, String label) {
    final isSelected = statusSelecionado == status;
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? Colors.green : Colors.grey[300],
        foregroundColor: isSelected ? Colors.white : Colors.black,
      ),
      onPressed: () {
        setState(() {
          statusSelecionado = status;
        });
      },
      child: Text(label),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Map<int, String> mapaContatos = {
      for (var contato in contatos)
        contato["id"] as int: (contato['name'] ?? "Desconhecido").toString(),
    };

    final processosFiltrados = processos.where((p) {
      final status = p['contatoStatus'];
      final processo = p['processoSider']?.toString().toLowerCase() ?? '';
      final matchesBusca = processo.contains(termoBusca);
      final matchesStatus =
          statusSelecionado == null || status == statusSelecionado;
      return matchesBusca && matchesStatus;
    }).toList();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: isLoading
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
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _buildFiltroButton(null, "Todos"),
                      _buildFiltroButton("REVISÃO DE PROJETO", "Revisão"),
                      _buildFiltroButton("IMPLANTAÇÃO", "Implantação"),
                      _buildFiltroButton("ASSINATURAS", "Assinaturas"),
                      _buildFiltroButton(
                        "VISTORIA INICIAL",
                        "Vistoria Inicial",
                      ),
                      _buildFiltroButton("VISTORIA FINAL", "Vistoria Final"),
                      _buildFiltroButton("CANCELADO/ARQUIVADO", "Cancelado/Arquivado"),
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
                                        processos['userId'] == userId;
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
                                                    userId;
                                                final resposta = await repo
                                                    .processos
                                                    .atualizarProcessos(
                                                      processos["id"],
                                                      dataAtualizada,
                                                    );
                                                carregarProcessoss();
                                                showDialog(
                                                  context: context,
                                                  builder: (context) => AlertDialog(
                                                    title: const Text(
                                                      'Sucesso',
                                                    ),
                                                    content: Text(
                                                      resposta["message"] ??
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
