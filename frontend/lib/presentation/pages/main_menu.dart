import 'package:flutter/material.dart';
import '../../core/modular_form.dart';
import '../../data/contato_repository.dart';
import '../widgets/contato_card.dart';
import '../../core/delete_dialog.dart';
import '../../data/salvar_dados.dart';

class MainMenu extends StatefulWidget {
  const MainMenu({super.key});

  @override
  State<MainMenu> createState() => _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  final repo = ContatoRepository();
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
  }

  Future<void> carregarContatos() async {
    if (userId == null) return;

    setState(() {
      isLoading = true;
    });

    try {
      final data = await repo.getContatos(userId: userId!);
      setState(() {
        contatos = data;
      });
    } catch (e) {
      debugPrint('Erro ao carregar contatos: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> deletarContato(int id) async {
    await repo.deletar(id);
    carregarContatos();
  }

  void abrirFormulario({Map<String, dynamic>? contato}) {
    showDialog(
      context: context,
      builder: (context) => ModularFormDialog(
        titulo: contato == null ? 'Novo Contato' : 'Editar Contato',
        dataInicial: contato,
        camposTexto: [
          {'label': 'Nome', 'key': 'name'},
          {'label': 'Telefone', 'key': 'number'},
          {'label': 'Email', 'key': 'email'},
          {'label': 'Assunto', 'key': 'subject'},
          {'label': 'Ultimo contato', 'key': 'lastSent', "type": "date"},
          {'label': 'Processo Sider', 'key': 'processoSider'},
          {'label': 'Protocolo', 'key': 'protocolo'},
        ],
        camposDropdown: [
          {
            'label': 'Prioridade',
            'key': 'priority',
            'itens': [
              {'label': 'Baixo', 'value': 'BAIXO'},
              {'label': 'Médio', 'value': 'MEDIO'},
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
            ],
          },
        ],
        onSubmit: (data) async {
          data['userId'] = userId;
          if (contato == null) {
            await repo.criar(data);
          } else {
            await repo.atualizar(contato['id'], data);
          }
          carregarContatos();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final contatosFiltrados = contatos.where((contato) {
      final nome = contato['name']?.toString().toLowerCase() ?? '';
      return nome.contains(termoBusca);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Meus Processos'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => ConfirmDeleteDialog(
                  titulo: 'Confirmar Logout',
                  mensagem: 'Deseja realmente sair?',
                  onConfirm: () async {
                    await logout();
                    Navigator.pushReplacementNamed(context, '/');
                  },
                ),
              );
            },
          ),
        ],
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
                    child: contatosFiltrados.isEmpty
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
                            children: contatosFiltrados.map((contato) {
                              return ContatoCard(
                                contato: contato,
                                onEdit: () => abrirFormulario(contato: contato),
                                onDelete: () => showDialog(
                                  context: context,
                                  builder: (context) => ConfirmDeleteDialog(
                                    titulo: 'Confirmar Exclusão',
                                    mensagem:
                                        'Tem certeza que deseja deletar este contato?',
                                    onConfirm: () {
                                      deletarContato(contato['id']);
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
            carregarContatos();
          },
          icon: const Icon(Icons.folder_copy),
          label: const Text('Acessar Todos os Processos'),
        ),
      ),
    );
  }
}
