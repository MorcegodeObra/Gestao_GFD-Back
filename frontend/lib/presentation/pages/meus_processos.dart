import 'package:flutter/material.dart';
import 'package:frontend/presentation/widgets/processo_card.dart';
import '../widgets/modular_form.dart';
import '../../core/API/api_controller.dart';
import '../widgets/delete_dialog.dart';
import '../../core/UTILS/salvar_dados.dart';
import '../widgets/app_drawer.dart';

class MainMenu extends StatefulWidget {
  const MainMenu({super.key});

  @override
  State<MainMenu> createState() => _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  final repo = ApiService();
  List<dynamic> processos = [];
  List<dynamic> contatos = [];
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
      final data = await repo.processos.getProcessos(userId: userId!);
      setState(() {
        processos = data;
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

  void abrirFormulario({Map<String, dynamic>? processos}) {
    final contatosDropdown = contatos.map((contato) {
      return {
        'label': contato['name'] ?? 'Sem nome',
        'value': contato['id'].toString(), // <-- converte para String
      };
    }).toList();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => ModularFormDialog(
        titulo: processos == null ? 'Novo Processos' : 'Editar Processos',
        dataInicial: processos,
        camposTexto: [
          {'label': 'Processo Sider', 'key': 'processoSider'},
          {'label': 'Protocolo', 'key': 'protocolo'},
          {'label': 'Assunto', 'key': 'subject'},
          {'label': 'Ultimo contato', 'key': 'lastSent', "type": "date"},
        ],
        camposDropdown: [
          {'label': 'Contato', 'key': 'contatoId', 'itens': contatosDropdown},
          {
            'label': 'Prioridade',
            'key': 'priority',
            'itens': [
              {'label': 'Baixo', 'value': 'BAIXO'},
              {'label': 'Médio', 'value': 'MÉDIO'},
              {'label': 'Alto', 'value': 'ALTO'},
              {'label': 'Urgente', 'value': 'URGENTE'},
            ],
          },
          {
            'label': 'Area',
            'key': 'area',
            'itens': [
              {'label': 'AREA 1', 'value': 'AREA 1'},
              {'label': 'AREA 2', 'value': 'AREA 2'},
              {'label': 'AREA 3', 'value': 'AREA 3'},
              {'label': 'AREA 4', 'value': 'AREA 4'},
              {'label': 'AREA 5', 'value': 'AREA 5'},
            ],
          },
          {
            'label': 'Status',
            'key': 'contatoStatus',
            'itens': [
              {'label': 'REVISÃO DE PROJETO', 'value': 'REVISÃO DE PROJETO'},
              {'label': 'IMPLANTAÇÃO', 'value': 'IMPLANTAÇÃO'},
              {'label': 'VISTORIA INICIAL', 'value': 'VISTORIA INICIAL'},
              {'label': 'VISTORIA FINAL', 'value': 'VISTORIA FINAL'},
              {'label': 'ASSINATURAS', 'value': 'ASSINATURAS'},
              {'label': 'SEM STATUS', 'value': 'SEM STATUS'},
            ],
          },
          {
            "label": "Respondido",
            "key": "answer",
            "itens": [
              {"label": "Sim", "value": "true"},
              {"label": "Não", "value": "false"},
            ],
          },
        ],
        onSubmit: (data) async {
          data['userId'] = userId;
          if (processos == null) {
            await repo.processos.criarProcessos(data);
          } else {
            await repo.processos.atualizarProcessos(processos['id'], data);
          }
          carregarProcessoss();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Map<int, String> mapaContatos = {
      for (var contato in contatos)
        contato["id"] as int: (contato['name'] ?? "Desconhecido").toString()
    };
    final processosFiltrados = processos.where((processos) {
      final processo =
          processos['processoider']?.toString().toLowerCase() ?? '';
      return processo.contains(termoBusca);
    }).toList();

    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text('Meus processos'),
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
                                onEdit: () =>
                                    abrirFormulario(processos: processos),
                                onDelete: () => showDialog(
                                  context: context,
                                  builder: (context) => ConfirmDeleteDialog(
                                    titulo: 'Confirmar Exclusão',
                                    mensagem:
                                        'Tem certeza que deseja deletar este Processos?',
                                    onConfirm: () {
                                      deletarProcessos(processos['id']);
                                    },
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                  ),
                ],
              ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF28582E),
        onPressed: () => abrirFormulario(),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
