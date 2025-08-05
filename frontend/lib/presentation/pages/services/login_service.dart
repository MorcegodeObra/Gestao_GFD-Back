import 'package:flutter/material.dart';
import '../../../core/API/api_controller.dart';
import '../../../core/UTILS/salvar_dados.dart';

Future<void> login({
  required BuildContext context,
  required TextEditingController emailController,
  required TextEditingController senhaController,
  required Function(bool) setloading,
}) async {
  setloading(true);
  final ApiService apiService = ApiService();
  try {
    final response = await apiService.users.login({
      'userEmail': emailController.text.trim(),
      'password': senhaController.text.trim(),
    });
    final user = response['user']; // Dados do usuário retornado do backend
    await salvarDadosUsuario(user);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sucesso'),
        content: const Text('Login bem-sucedido!'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/mainPage');
            },
            child: const Text('Ok'),
          ),
        ],
      ),
    );
  } catch (e) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Erro'),
        content: Text(e.toString()),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Ok'),
          ),
        ],
      ),
    );
  }

  setloading(false);
}

