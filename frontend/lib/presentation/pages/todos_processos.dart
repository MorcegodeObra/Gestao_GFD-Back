import 'package:flutter/material.dart';
import '../../core/modular_form.dart';
import '../../data/contato_repository.dart';
import '../widgets/contato_card.dart';
import '../../core/delete_dialog.dart';
import '../../data/salvar_dados.dart';

class Todosprocessos extends StatefulWidget {
  const Todosprocessos({super.key});

  @override
  State<Todosprocessos> createState() => _TodosprocessosState();
}

class _TodosprocessosState extends State<Todosprocessos> {
  final repo = ContatoRepository();
  List<dynamic> contatos = [];
  int? userId;

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
    carregarContatos();
  }

  Future<void> carregarContatos() async {
    if (userId == null) return;
    final data = await repo.getContatos();
    setState(() {
      contatos = data;
    });
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
        ],
        onSubmit: (data) async {
          data['lastUserModified'] = userId;
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
    return Scaffold(
      appBar: AppBar(title: const Text('Contatos')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: contatos.isEmpty
            ? const Center(
                child: Text(
                  'Nenhum processo encontrado.',
                  style: TextStyle(fontSize: 16, color: Colors.black54),
                ),
              )
            : ListView(
                children: contatos.map((contato) {
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
    );
  }
}
