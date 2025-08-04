import 'package:flutter/material.dart';
import 'package:frontend/core/API/api_controller.dart';
import '../widgets/app_navbar.dart';
import '../../core/UTILS/salvar_dados.dart';
import '../pages/main_page.dart';
import '../pages/contatos_page.dart';
import '../pages/meus_processos.dart';
import '../pages/todos_processos.dart';
import '../widgets/delete_dialog.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({Key? key}) : super(key: key);

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int paginaAtual = 0;
  final ApiService repo = ApiService();

  List<dynamic> processos = [];
  List<dynamic> contatos = [];
  int? userId;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    carregarDados();
  }

  Future<void> carregarDados() async {
    final userData = await getDadosUsuario();
    userId = userData['userId'];
    contatos = await repo.contatos.getContatos();
    processos = await repo.processos.getProcessos();

    setState(() {
      isLoading = false;
    });
  }

  Future<void> atualizarProcesso(int id, Map<String, dynamic> data) async {
    await repo.processos.atualizarProcessos(id, data);
    carregarDados();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Sucesso'),
        content: Text("O processo foi atualizado com sucesso."),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text("OK"),
          ),
        ],
      ),
    );
  }

  void deletarProcesso(int id) async {
    await repo.processos.deletarProcessos(id);
    removerProcessoDaLista(id);
  }

  void aceitarEnvioProcesso(int id, Map<String, dynamic> data) async {
    final atualizado = await repo.processos.aceitarEnvioProcesso(id, data);
    atualizarProcessoNaLista(atualizado);
  }

  void atualizarProcessoNaLista(Map<String, dynamic> processoAtualizado) {
    final id = processoAtualizado['id'];
    final index = processos.indexWhere((p) => p['id'] == id);
    if (!mounted) return;
    if (index != -1) {
      setState(() {
        processos[index] = processoAtualizado;
      });
    }
  }

  void removerProcessoDaLista(int id) {
    setState(() {
      processos.removeWhere((p) => p['id'] == id);
    });
  }

  void criarProcesso(Map<String, dynamic> data) async {
    final novo = await repo.processos.criarProcessos(data);
    setState(() {
      processos.add(novo);
    });
  }

  void criarContato(Map<String, dynamic> data) async {
    final novo = await repo.contatos.criarContatos(data);
    setState(() {
      contatos.add(novo);
    });
  }

  void addEmail(int id, List<Map<String, dynamic>> data) async {
    final novo = await repo.contatos.adicionarEmail(id, data);
    setState(() {
      contatos.add(novo);
    });
  }

  void editarEmail(Map<String, dynamic> data) async {
    try {
      await repo.contatos.editarEmail(
        contatoId: data['contatoId'],
        emailId: data['emailId'],
        emailData: data['emailData'],
      );
      setState(() {
        carregarDados();
      });
    } catch (e) {
      print("Erro ao editar email: $e");
    }
  }

  void deletarEmail(Map<String, dynamic> data) async {
    try {
      await repo.contatos.deletarEmail(
        contatoId: data['contatoId'],
        emailId: data['emailId'],
      );
      setState(() {
        carregarDados();
      });
    } catch (e) {
      print("Erro ao deletar email: $e");
    }
  }

  void _logout(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => ConfirmDeleteDialog(
        titulo: 'Confirmar Logout',
        mensagem: 'Deseja realmente sair?',
        onConfirm: () async {
          await logout();
          Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> paginas = [
      GraficoProcessosPage(
        processos: processos,
        contatos: contatos,
        userId: userId,
        isLoading: isLoading,
      ),
      Contatos(
        contatos: contatos,
        userId: userId,
        isLoading: isLoading,
        criarContatos: criarContato,
        editarEmailsContatos: editarEmail,
        deletarEmailsContatos: deletarEmail,
      ),
      MainMenu(
        userId: userId,
        processos: processos,
        contatos: contatos,
        atualizarProcessos: atualizarProcesso,
        criarProcesso: criarProcesso,
        carregarDados: carregarDados,
        aceitarEnvioProcesso: aceitarEnvioProcesso,
        deletarProcesso: deletarProcesso,
        isLoading: isLoading,
      ),
      TodosProcessos(
        userId: userId,
        processos: processos,
        contatos: contatos,
        atualizarProcessos: atualizarProcesso,
        carregarDados: carregarDados,
        isLoading: isLoading,
      ),
    ];
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false, // REMOVE o botão de retorno
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Image.asset(
              'assets/icon.png', // substitua pelo caminho correto da sua logo
              height: 40,
            ),
            Text("Sistema GFD"),
            IconButton(
              icon: Icon(Icons.logout),
              onPressed: () => _logout(context),
            ),
          ],
        ),
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : IndexedStack(index: paginaAtual, children: paginas),
      bottomNavigationBar: AppNavBar(
        currentIndex: paginaAtual,
        onTap: (index) {
          setState(() {
            paginaAtual = index;
          });
        },
      ),
    );
  }
}
