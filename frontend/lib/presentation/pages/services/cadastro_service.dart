import 'package:flutter/material.dart';
import '../../../core/API/api_controller.dart';

Future<void> cadastrar({
  required BuildContext context,
  required TextEditingController nomeController,
  required TextEditingController numeroController,
  required TextEditingController emailController,
  required TextEditingController senhaController,
  required areaSelecionada,
  required cargoSelecionado,
  required Function(bool) setloading,
}) async {
  setloading(true);
  final ApiService apiService = ApiService();

  try {
    await apiService.users.criarUsuario({
      'userName': nomeController.text.trim(),
      'userNumber': numeroController.text.trim(),
      'userEmail': emailController.text.trim(),
      'password': senhaController.text.trim(),
      'userArea': areaSelecionada,
      'userCargo': cargoSelecionado,
    });

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sucesso'),
        content: const Text('Cadastro realizado com sucesso!'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.pop(context);
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
