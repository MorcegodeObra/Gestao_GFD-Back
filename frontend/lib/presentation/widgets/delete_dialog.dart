import 'package:flutter/material.dart';

class ConfirmDeleteDialog extends StatelessWidget {
  final String titulo;
  final String mensagem;
  final Future<void> Function() onConfirm;

  const ConfirmDeleteDialog({
    super.key,
    required this.titulo,
    required this.mensagem,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(titulo),
      content: Text(mensagem),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text("Cancelar"),
        ),
        TextButton(
          onPressed: () {
            onConfirm();
            Navigator.of(context).pop();
          },
          child: const Text("Ok"),
        ),
      ],
    );
  }
}
