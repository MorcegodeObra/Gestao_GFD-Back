import 'package:flutter/material.dart';
import './delete_dialog.dart';
import '../../core/UTILS/salvar_dados.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          // Parte superior: header e itens
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                Container(
                  height: 100,
                  color: Color(0xFF28582E),
                  padding: EdgeInsets.only(top: 25, left: 20),
                  child: Row(
                    children: [
                      Text(
                        'Selecione a página:',
                        style: TextStyle(color: Colors.white, fontSize: 24),
                      ),
                    ],
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.home),
                  title: const Text('Principal'),
                  onTap: () => Navigator.pushNamed(context, '/mainPage'),
                ),
                ListTile(
                  leading: const Icon(Icons.contacts),
                  title: const Text('Contatos'),
                  onTap: () => Navigator.pushNamed(context, '/contatos'),
                ),
                ListTile(
                  leading: const Icon(Icons.folder_copy),
                  title: const Text('Meus processos'),
                  onTap: () => Navigator.pushNamed(context, '/meusProcessos'),
                ),
                ListTile(
                  leading: const Icon(Icons.dns),
                  title: const Text('Todos os processos'),
                  onTap: () => Navigator.pushNamed(context, '/todosProcessos'),
                ),
              ],
            ),
          ),

          Container(
            color: const Color(0xFF28582E),
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Spacer(),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Deslogar',
                      style: TextStyle(color: Colors.white, fontSize: 14),
                    ),
                    IconButton(
                      icon: const Icon(Icons.logout),
                      color: Colors.white,
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => ConfirmDeleteDialog(
                            titulo: 'Confirmar Logout',
                            mensagem: 'Deseja realmente sair?',
                            onConfirm: () async {
                              await logout();
                              Navigator.pushNamedAndRemoveUntil(context,'/',(route)=> false);
                            },
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
