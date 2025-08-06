import 'package:flutter/material.dart';
import 'dropdown_padrao.dart';
import '../../core/UTILS/forms_utils.dart';

class ModularFormDialog extends StatefulWidget {
  final String titulo;
  final Map<String, dynamic>? dataInicial;
  final List<Map<String, dynamic>> camposTexto;
  final List<Map<String, dynamic>> camposDropdown;
  final Future<void> Function(Map<String, dynamic>) onSubmit;
  final String? contato;

  const ModularFormDialog({
    super.key,
    required this.titulo,
    this.dataInicial,
    required this.camposTexto,
    required this.camposDropdown,
    required this.onSubmit,
    this.contato,
  });

  @override
  State<ModularFormDialog> createState() => _ModularFormDialogState();
}

class _ModularFormDialogState extends State<ModularFormDialog> {
  final Map<String, TextEditingController> textControllers = {};
  final Map<String, String?> dropdownSelecionados = {};
  int _currentStep = 0;
  Map<String, dynamic> contatoSelecionado = {};
  List<Map<String, dynamic>> emails = [
    {"email": "", "area": "", "rodovias": <String>[]},
  ];
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
      } else if (valorInicial != null) {
        // Converte qualquer outro valor para string (se não for nulo)
        valorInicial = valorInicial.toString();
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
        child: IndexedStack(
          index: _currentStep,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Campos de texto padrão
                ...widget.camposTexto.map((campo) {
                  final isDate = FormUtils.isDateField(campo);
                  final controller = textControllers[campo['key']]!;
                  final isMultiline = campo['key'] == 'subject';

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
                          maxLines: isMultiline ? 4 : 1,
                          minLines: isMultiline ? 3 : 1,
                          keyboardType: isMultiline
                              ? TextInputType.multiline
                              : TextInputType.text,
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

                // Dropdowns
                if (widget.camposDropdown.isNotEmpty) ...[
                  ...widget.camposDropdown.map(
                    (drop) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: DropdownPadrao(
                        label: drop['label'],
                        itens: (drop['itens'] as List)
                            .map(
                              (item) => {
                                'label': item['label'].toString(),
                                'value': item['value'].toString(),
                              },
                            )
                            .toList()
                            .cast<Map<String, String>>(),
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

                if (widget.contato == "contatoPage") ...[
                  const Text(
                    'E-mails do contato:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),

                  // Campos de e-mail dinâmicos
                  ...emails.asMap().entries.map((entry) {
                    final index = entry.key;
                    final email = entry.value;

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          decoration: const InputDecoration(labelText: 'Email'),
                          onChanged: (value) => email['email'] = value,
                        ),
                        DropdownPadrao(
                          label: 'Área',
                          itens: [
                            {'label': 'AREA 1', 'value': 'AREA 1'},
                            {'label': 'AREA 2', 'value': 'AREA 2'},
                            {'label': 'AREA 3', 'value': 'AREA 3'},
                            {'label': 'AREA 4', 'value': 'AREA 4'},
                            {'label': 'AREA 5', 'value': 'AREA 5'},
                          ],
                          valorSelecionado: email['area'].isNotEmpty
                              ? email['area']
                              : null,
                          onChanged: (valor) {
                            setState(() {
                              email['area'] = valor ?? '';
                            });
                          },
                        ),

                        TextField(
                          decoration: const InputDecoration(
                            labelText: 'Rodovias (separadas por vírgula)',
                          ),
                          onChanged: (value) {
                            email['rodovias'] = value
                                .split(',')
                                .map((e) => e.trim())
                                .where((e) => e.isNotEmpty)
                                .toList();
                          },
                        ),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              setState(() => emails.removeAt(index));
                            },
                            child: const Text('Remover'),
                          ),
                        ),
                        const Divider(),
                      ],
                    );
                  }),

                  Center(
                    child: TextButton(
                      onPressed: () {
                        setState(() {
                          emails.add({
                            'email': '',
                            'area': '',
                            'rodovias': <String>[],
                          });
                        });
                      },
                      child: const Text('Adicionar outro email'),
                    ),
                  ),
                ],
              ],
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

            // Campos de texto
            textControllers.forEach((key, controller) {
              final campo = widget.camposTexto.firstWhere(
                (e) => e['key'] == key,
              );
              if (FormUtils.isDateField(campo)) {
                final date = FormUtils.parseDateFromDisplay(
                  controller.text.trim(),
                );
                data[key] = date != null
                    ? FormUtils.formatDateToBackend(date)
                    : controller.text;
              } else {
                data[key] = controller.text.trim();
              }
            });

            // Dropdowns
            dropdownSelecionados.forEach((key, valor) {
              if (valor == "true") {
                data[key] = true;
              } else if (valor == "false") {
                data[key] = false;
              } else {
                data[key] = valor ?? '';
              }
            });

            // E-mails
            data['ContactEmails'] = emails;

            try {
              await widget.onSubmit(data);
              if (context.mounted) Navigator.pop(context);
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
