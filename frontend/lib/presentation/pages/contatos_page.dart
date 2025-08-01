import 'package:flutter/material.dart';
import '../widgets/modular_form.dart';
import '../../core/API/api_controller.dart';
import '../widgets/contato_card.dart';

class Contatos extends StatefulWidget {
  final bool isLoading;
  final int? userId;
  final List<dynamic> contatos;
  final void Function(Map<String, dynamic>) criarContatos;
  final void Function(Map<String, dynamic>) editarEmailsContatos;
  final void Function(Map<String, dynamic>) deletarEmailsContatos;

  const Contatos({
    super.key,
    required this.contatos,
    required this.isLoading,
    required this.userId,
    required this.criarContatos,
    required this.editarEmailsContatos,
    required this.deletarEmailsContatos,
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

  void abrirFormularioEmail({Map<String, dynamic>? contatos}) {
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
            await repo.contatos.editarEmail(
              emailId: contatos['id'],
              contatoId: contatos['id'],
              emailData: data,
            );
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
    final contatosFiltrados = widget.contatos.where((c) {
      final matchesBusca =
          c['name']?.toLowerCase().contains(termoBusca.toLowerCase()) ?? false;
      return matchesBusca;
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
                      labelText: "Buscar por contato",
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
                            children: contatosFiltrados.map((contatos) {
                              return ContatoCard(
                                contato: contatos,
                                onEdit: () =>
                                    widget.criarContatos(contatos), //TODO
                                onDelete: () =>
                                    widget.criarContatos(contatos['id']), //TODO
                                onDeleteEmail: (contatoId, emailId) {
                                  widget.deletarEmailsContatos({
                                    'contatoId': contatoId,
                                    'emailId': emailId,
                                  });
                                },
                                onEditEmail: (contato, emailData) async {
                                  // Abre um modal ou página para editar o email
                                  final novoEmail =
                                      await showDialog<Map<String, dynamic>>(
                                        context: context,
                                        builder: (context) {
                                          return ModularFormDialog(
                                            titulo: 'Editar E-mail',
                                            dataInicial: emailData,
                                            camposTexto: [
                                              {
                                                'label': 'E-mail',
                                                'key': 'email',
                                              },
                                            ],
                                            camposDropdown: [],
                                            contato: "contatoPage",
                                            onSubmit: (novoEmail) {
                                              Navigator.of(
                                                context,
                                              ).pop(novoEmail);
                                              return (novoEmail['id']);
                                            },
                                          );
                                        },
                                      );

                                  if (novoEmail != null) {
                                    widget.editarEmailsContatos({
                                      'contatoId': contato['id'],
                                      'emailId': emailData['id'],
                                      'emailData': novoEmail,
                                    });
                                  }
                                },
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
