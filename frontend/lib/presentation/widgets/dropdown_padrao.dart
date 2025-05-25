import 'package:flutter/material.dart';

class DropdownPadrao extends StatelessWidget {
  final String label;
  final List<Map<String, String>> itens; // Lista com label e value
  final String? valorSelecionado;
  final ValueChanged<String?> onChanged;

  const DropdownPadrao({
    super.key,
    required this.label,
    required this.itens,
    required this.valorSelecionado,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: valorSelecionado,
      decoration: InputDecoration(
        labelText: label,
        filled: true,
        fillColor: Colors.white,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
      items: itens.map((item) {
        return DropdownMenuItem<String>(
          value: item['value'],
          child: Text(item['label']!),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }
}
