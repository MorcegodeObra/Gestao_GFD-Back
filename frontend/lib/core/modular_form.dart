import 'package:flutter/material.dart';
import '../presentation/widgets/dropdown_padrao.dart';
import '../utils/forms_utils.dart';

class ModularFormDialog extends StatefulWidget {
  final String titulo;
  final Map<String, dynamic>? dataInicial;
  final List<Map<String, dynamic>> camposTexto;
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

    // Inicializar campos texto
    for (var campo in widget.camposTexto) {
      final key = campo['key']!;
      textControllers[key] = TextEditingController(
        text: widget.dataInicial?[key] != null
            ? FormUtils.isDateField(campo)
                  ? FormUtils.formatDateToDisplay(
                      DateTime.tryParse(widget.dataInicial![key]) ??
                          DateTime.now(),
                    )
                  : widget.dataInicial![key].toString()
            : '',
      );
    }

    // Inicializar dropdowns
    for (var drop in widget.camposDropdown) {
      final chave = drop['key'];
      var valorInicial = widget.dataInicial?[chave];

      // Se o campo for "answer" e o valor for bool, converte para string
      if (chave == 'answer' && valorInicial is bool) {
        valorInicial = valorInicial ? 'true' : 'false';
      }

      dropdownSelecionados[chave] = valorInicial;
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
            // Campos de texto e data
            ...widget.camposTexto.map((campo) {
              final isDate = FormUtils.isDateField(campo);
              final controller = textControllers[campo['key']]!;

              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: GestureDetector(
                  onTap: isDate
                      ? () => FormUtils.pickDate(
                          context: context,
                          controller: controller,
                        )
                      : null,
                  child: AbsorbPointer(
                    absorbing: isDate,
                    child: TextField(
                      controller: controller,
                      decoration: InputDecoration(
                        labelText: campo['label'],
                        border: const OutlineInputBorder(),
                        filled: true,
                        fillColor: Colors.white,
                        suffixIcon: isDate
                            ? const Icon(Icons.calendar_today)
                            : null,
                      ),
                    ),
                  ),
                ),
              );
            }),

            // Campos dropdown
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

            // Dados dos campos texto e data
            textControllers.forEach((key, controller) {
              final campo = widget.camposTexto.firstWhere(
                (e) => e['key'] == key,
              );
              if (FormUtils.isDateField(campo)) {
                final date = FormUtils.parseDateFromDisplay(controller.text);
                data[key] = date != null
                    ? FormUtils.formatDateToBackend(date)
                    : controller.text;
              } else {
                data[key] = controller.text;
              }
            });

            // Dados dos dropdowns
            dropdownSelecionados.forEach((key, valor) {
              if (valor == "true") {
                data[key] = true;
              } else if (valor == "false") {
                data[key] = false;
              } else {
                data[key] = valor ?? '';
              }
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
