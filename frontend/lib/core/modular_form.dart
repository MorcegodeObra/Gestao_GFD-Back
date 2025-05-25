import 'package:flutter/material.dart';

class ModularForm extends StatelessWidget {
  final String titulo;
  final List<Widget> campos;
  final VoidCallback onSalvar;

  const ModularForm({
    Key? key,
    required this.titulo,
    required this.campos,
    required this.onSalvar,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(titulo)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ...campos,
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: onSalvar,
              child: const Text('Salvar'),
            ),
          ],
        ),
      ),
    );
  }
}
