import 'package:flutter/material.dart';
import '../widgets/app_navbar.dart';
import '../../core/UTILS/salvar_dados.dart';
import '../pages/main_page.dart';
import '../pages/contatos_page.dart';
import '../pages/meus_processos.dart';
import '../pages/todos_processos.dart';
import '../widgets/delete_dialog.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int paginaAtual = 0;

  final List<Widget> paginas = [
    GraficoProcessosPage(),
    Contatos(),
    MainMenu(),
    TodosProcessos(),
  ];

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
      body: IndexedStack(index: paginaAtual, children: paginas),
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
