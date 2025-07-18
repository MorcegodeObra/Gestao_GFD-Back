import 'package:flutter/material.dart';
import '../widgets/modular_form.dart';
import '../../core/API/api_controller.dart';
import '../widgets/contato_card.dart';
import '../widgets/delete_dialog.dart';

class Contatos extends StatefulWidget {
  final bool isLoading;
  final int? userId;
  final List<dynamic> contatos;
  final void Function(Map<String, dynamic>) criarContatos;

  const Contatos({
    super.key,
    required this.contatos,
    required this.isLoading,
    required this.userId,
    required this.criarContatos,
  });

  @override
  State<Contatos> createState() => _ContatosState();
}

class _ContatosState extends State<Contatos> {
  final ApiService repo = ApiService();
  final TextEditingController _searchController = TextEditingController();
  String termoBusca = '';

  @override
  void initState() {
    super.initState();
  }

  void abrirFormulario({Map<String, dynamic>? contatos}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => ModularFormDialog(
        titulo: contatos == null ? 'Nova Solicitante' : 'Editar Solicitante',
        dataInicial: contatos,
        camposTexto: [
          {'label': 'Nome', 'key': 'name'},
        ],
        contato: "contatoPage",
        camposDropdown: [],
        onSubmit: (data) async {
          data['userId'] = widget.userId;

          if (contatos == null) {
            // Criação de novo contato
            final contatoCriado = await repo.contatos.criarContatos({
              'name': data['name'],
              'userId': data['userId'],
            });

            final contatoId = contatoCriado['id'];

            // Envia os emails em um array
            final List<Map<String, dynamic>> emails =
                (data['ContactEmails'] as List).cast<Map<String, dynamic>>();

            if (emails.isNotEmpty) {
              await repo.contatos.adicionarEmail(contatoId, emails);
            }
          } else {
            // Atualização de contato (sem incluir emails aqui)
            await repo.contatos.atualizarContatos(contatos['id'], data);
          }
        },
      ),
    );
  }

  Future<void> deletarcontatos(int id) async {
    await repo.contatos.deletarcontatos(id);
  }

  @override
  Widget build(BuildContext context) {
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
                  Expanded(
                    child: widget.contatos.isEmpty
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
                            children: widget.contatos.map((contatos) {
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
                                    onConfirm: () async {
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
        heroTag: "contatos",
        backgroundColor: const Color(0xFF28582E),
        onPressed: () => abrirFormulario(),
        child: const Icon(Icons.person_add, color: Colors.white),
      ),
    );
  }
}
