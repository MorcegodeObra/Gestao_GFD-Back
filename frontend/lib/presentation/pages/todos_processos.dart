import 'package:flutter/material.dart';
import 'package:frontend/presentation/widgets/app_drawer.dart';
import '../../core/API/api_controller.dart';
import '../widgets/processo_card.dart';
import '../../core/UTILS/salvar_dados.dart';

class Todosprocessos extends StatefulWidget {
  const Todosprocessos({super.key});

  @override
  State<Todosprocessos> createState() => _Todosproprocessostate();
}

class _Todosproprocessostate extends State<Todosprocessos> {
  final repo = ApiService();
  List<dynamic> processos = [];
  List<dynamic> contatos = [];
  Set<int> abrirDetalhes = {};

  int? userId;
  bool isLoading = true;
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
    await carregarproprocessos();
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

  Future<void> carregarproprocessos() async {
    if (userId == null) return;

    setState(() {
      isLoading = true;
    });

    try {
      final data = await repo.processos.getProcessos(notUserId: userId!);
      setState(() {
        processos = data;
      });
    } catch (e) {
      debugPrint('Erro ao carregarprocessos: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final Map<int, String> mapaContatos = {
      for (var contato in contatos)
        contato["id"] as int: contato['nome'] as String,
    };
    final processosFiltrados = processos.where((processos) {
      final processo =
          processos['processoider']?.toString().toLowerCase() ?? '';
      return processo.contains(termoBusca);
    }).toList();

    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text('Todos os processos'),
        automaticallyImplyLeading: true,
        actions: [],
      ),
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
                        : ListView(
                            children: processosFiltrados.map((processos) {
                              final contatoId = processos['contatoId'];
                              final nomeContato =
                                  mapaContatos[contatoId] ?? "Desconhecido";
                              return ProcessoCard(
                                processo: processos,
                                contato: nomeContato,
                                editIcon: Icons.work,
                                onEdit: () async {
                                  try {
                                    final dataAtualizada =
                                        Map<String, dynamic>.from(processos);
                                    dataAtualizada["userId"] = userId;
                                    await repo.processos.atualizarProcessos(
                                      processos["id"],
                                      dataAtualizada,
                                    );
                                    carregarproprocessos();
                                    showDialog(
                                      context: context,
                                      builder: (context) => AlertDialog(
                                        title: const Text('Sucesso'),
                                        content: const Text(
                                          'Processo foi para sua carga!',
                                        ),
                                        actions: [
                                          TextButton(
                                            onPressed: () =>
                                                Navigator.pop(context),
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
                                                Navigator.of(context).pop(),
                                            child: const Text('OK'),
                                          ),
                                        ],
                                      ),
                                    );
                                  }
                                },
                              );
                            }).toList(),
                          ),
                  ),
                ],
              ),
      ),
    );
  }
}
