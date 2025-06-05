import 'package:flutter/material.dart';
import '../../core/modular_form.dart';
import '../../data/processos_repository.dart';
import '../widgets/contato_card.dart';
import '../../core/delete_dialog.dart';
import '../../data/salvar_dados.dart';

class MainMenu extends StatefulWidget {
  const MainMenu({super.key});

  @override
  State<MainMenu> createState() => _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  final repo = ProcessosRepository();
  List<dynamic> processos = [];
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
    await carregarProcessoss();
  }
  Future<void> carregarProcessoss() async {
    if (userId == null) return;
    setState(() {
      isLoading = true;
    });

    try {
      final data = await repo.getProcessos(userId: userId!);
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
    await repo.deletar(id);
   carregarProcessoss();
  }
  void abrirFormulario({Map<String, dynamic>? processos}) {
    showDialog(
     context: context,
      barrierDismissible: false,
      builder: (context) => ModularFormDialog(
        titulo: processos == null ? 'Novo Processos' : 'Editar Processos',
        dataInicial: processos,
       camposTexto: [
         {'label': 'Nome', 'key': 'name'},
          {'label': 'Telefone', 'key': 'number'},
          {'label': 'Email', 'key': 'email'},
          {'label': 'Assunto', 'key': 'subject'},
          {'label': 'Ultimo Processos', 'key': 'lastSent', "type": "date"},
          {'label': 'Processo Sider', 'key': 'processoSider'},
          {'label': 'Protocolo', 'key': 'protocolo'},
        ],
        camposDropdown: [
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
            'key': 'ProcessosStatus',
            'itens': [
             {'label': 'REVISÃO DE PROJETO', 'value': 'REVISÃO DE PROJETO'},
              {'label': 'IMPLANTAÇÃO', 'value': 'IMPLANTAÇÃO'},
              {'label': 'VISTORIA INICIAL', 'value': 'VISTORIA INICIAL'},
              {'label': 'VISTORIA FINAL', 'value': 'VISTORIA FINAL'},
              {'label': 'ASSINATURAS', 'value': 'ASSINATURAS'},
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
            await repo.criar(data);
          } else {
            await repo.atualizar(processos['id'], data);
          }
         carregarProcessoss();
        },
     ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final processosFiltrados = processos.where((processos) {
      final processo= processos['processoider']?.toString().toLowerCase() ?? '';
      return processo.contains(termoBusca);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Meus processos"),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Ir para graficos',
          onPressed: () {
            Navigator.pushReplacementNamed(context, '/mainPage');
          },
        ),
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
                              return ContatoCard(
                               contato: processos,
                                onEdit: ()=> abrirFormulario(processos: processos),
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
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(12),
        child: ElevatedButton.icon(
          onPressed: () async {
            await Navigator.pushNamed(context, '/todosProcessos');
            carregarProcessoss();
          },
         icon: const Icon(Icons.folder_copy),
          label: const Text('Acessar Todos os Processos'),
        ),
      ),
    );
  }
}
