import 'package:flutter/material.dart';
import '../../core/formatar_data.dart';
import '../../core/lista_textos.dart';

class ContatoCard extends StatelessWidget {
  final Map<String, dynamic> contato;
  final VoidCallback onEdit;
  final VoidCallback? onDelete;
  final IconData? editIcon;

  const ContatoCard({
    super.key,
    required this.contato,
    required this.onEdit,
    this.onDelete,
    this.editIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Texto
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    contato['name'] ?? 'Sem nome',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text.rich(
                    TextSpan(
                      children: [
                        ...gerarTextSpan({
                          'Telefone': contato['number'],
                          'Assunto': contato['subject'],
                          'Email': contato['email'],
                          'Ultimo contato': formatarData(contato['lastSent']),
                        }),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Botões
            SizedBox(
              height: 100,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  IconButton(
                    icon: Icon(editIcon ?? Icons.edit, color: Colors.blue),
                    onPressed: onEdit,
                  ),
                  if (onDelete != null)
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: onDelete,
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
