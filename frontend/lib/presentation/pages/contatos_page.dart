import 'package:flutter/material.dart';
import '../widgets/modular_form.dart';
import '../../core/API/api_controller.dart';
import '../widgets/contato_card.dart';
import '../widgets/delete_dialog.dart';
import '../widgets/app_drawer.dart';

class Contatos extends StatefulWidget {
  const Contatos({super.key});

  @override
  State<Contatos> createState() => _ContatosState();
}

class _ContatosState extends State<Contatos> {
  final repo = ApiService();
  List<dynamic> contatos = [];
  int? userId;
  bool isLoading = true;
  final TextEditingController _searchController = TextEditingController();
  String termoBusca = '';

  @override
  void initState() {
    super.initState();
    carregarContatos();
  }

  Future<void> carregarContatos() async {
    setState(() {
      isLoading = true;
    });

    try {
      final data = await repo.contatos.getContatos();
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

  void abrirFormulario({Map<String, dynamic>? contatos}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => ModularFormDialog(
        titulo: contatos == null ? 'Novo contato' : 'Editar contato',
        dataInicial: contatos,
        camposTexto: [
          {'label': 'Nome', 'key': 'name'},
          {'label': 'Email', 'key': 'email'},
          {'label': 'Numero', 'key': 'number'},
        ],
        camposDropdown: [],
        onSubmit: (data) async {
          data['userId'] = userId;
          if (contatos == null) {
            await repo.contatos.criarContatos(data);
          } else {
            await repo.contatos.atualizarContatos(contatos['id'], data);
          }
          carregarContatos();
        },
      ),
    );
  }

  Future<void> deletarcontatos(int id) async {
    await repo.contatos.deletarcontatos(id);
    carregarContatos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text('Meus contatos'),
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
                    child: contatos.isEmpty
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
                            children: contatos.map((contatos) {
                              return ContatoCard(
                                contato: contatos,
                                onEdit: () =>
                                    abrirFormulario(contatos: contatos),
                                onDelete: () => showDialog(
                                  context: context,
                                  builder: (context) => ConfirmDeleteDialog(
                                    titulo: 'Confirmar Exclusão',
                                    mensagem:
                                        'Tem certeza que deseja deletar este contatos?',
                                    onConfirm: () {
                                      deletarcontatos(contatos['id']);
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
