import 'package:flutter/material.dart';
import '../presentation/widgets/dropdown_padrao.dart';

class ModularFormDialog extends StatefulWidget {
  final String titulo;
  final Map<String, dynamic>? dataInicial;
  final List<Map<String, String>> camposTexto;
  final List<Map<String, dynamic>> camposDropdown;
  final Future<void> Function(Map<String, dynamic>) onSubmit;

  const ModularFormDialog({
    super.key,
    required this.titulo,
    this.dataInicial,
    required this.camposTexto,
    required this.camposDropdown,
    required this.onSubmit,
  });

  @override
  State<ModularFormDialog> createState() => _ModularFormDialogState();
}

class _ModularFormDialogState extends State<ModularFormDialog> {
  final Map<String, TextEditingController> textControllers = {};
  final Map<String, String?> dropdownSelecionados = {};

  @override
  void initState() {
    super.initState();

    // Inicializar TextFields
    for (var campo in widget.camposTexto) {
      final key = campo['key']!;
      textControllers[key] = TextEditingController(
        text: widget.dataInicial?[key] ?? '',
      );
    }

    // Inicializar Dropdowns
    for (var drop in widget.camposDropdown) {
      final chave = drop['key'];
      dropdownSelecionados[chave] = widget.dataInicial?[chave];
    }
  }

  @override
  void dispose() {
    for (var controller in textControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.titulo),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // TextFields
            ...widget.camposTexto.map(
              (campo) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: TextField(
                  controller: textControllers[campo['key']]!,
                  decoration: InputDecoration(
                    labelText: campo['label'],
                    border: const OutlineInputBorder(),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                ),
              ),
            ),

            // Dropdowns
            ...widget.camposDropdown.map(
              (drop) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: DropdownPadrao(
                  label: drop['label'],
                  itens: List<Map<String, String>>.from(drop['itens']),
                  valorSelecionado: dropdownSelecionados[drop['key']],
                  onChanged: (valor) {
                    setState(() {
                      dropdownSelecionados[drop['key']] = valor;
                    });
                  },
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () async {
            final data = <String, dynamic>{};

            // Dados dos TextFields
            textControllers.forEach((key, controller) {
              data[key] = controller.text;
            });

            // Dados dos Dropdowns
            dropdownSelecionados.forEach((key, valor) {
              data[key] = valor ?? '';
            });

            try {
              await widget.onSubmit(data);

              if (context.mounted) {
                Navigator.pop(context); // Fecha o formulário

                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Sucesso'),
                    content: const Text('Dados salvos com sucesso!'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('OK'),
                      ),
                    ],
                  ),
                );
              }
            } catch (e) {
              if (context.mounted) {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Erro'),
                    content: Text('Ocorreu um erro ao salvar: $e'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('OK'),
                      ),
                    ],
                  ),
                );
              }
            }
          },
          child: const Text('Salvar'),
        ),
      ],
    );
  }
}
