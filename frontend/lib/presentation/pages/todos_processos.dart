import 'package:flutter/material.dart';
import '../../data/contato_repository.dart';
import '../widgets/contato_card.dart';
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
      final data = await repo.getContatos(notUserId: userId!);
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

  @override
  Widget build(BuildContext context) {
    final contatosFiltrados = contatos.where((contato) {
      final processo = contato['processoSider']?.toString().toLowerCase() ?? '';
      return processo.contains(termoBusca);
    }).toList();

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        title: const Text('Todos Processos'),
        automaticallyImplyLeading: false,
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
                                editIcon: Icons.work,
                                onEdit: () async {
                                  try {
                                    final dataAtualizada =
                                        Map<String, dynamic>.from(contato);
                                    dataAtualizada["userId"] = userId;
                                    await repo.atualizar(
                                      contato["id"],
                                      dataAtualizada,
                                    );
                                    carregarContatos();
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
