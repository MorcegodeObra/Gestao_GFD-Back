import 'package:flutter/material.dart';

class ContatoCard extends StatefulWidget {
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
  State<ContatoCard> createState() => _ContatoCardState();
}

class _ContatoCardState extends State<ContatoCard> {
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
                    widget.contato['name'] ?? 'Sem processo',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      children: [
                        const TextSpan(
                          text: "Emails:\n",
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        ...?widget.contato['ContactEmails']?.map<TextSpan>((
                          emailInfo,
                        ) {
                          return TextSpan(
                            text:
                                "${emailInfo['email']} - ${emailInfo['area']}\n",
                          );
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
                    icon: Icon(
                      widget.editIcon ?? Icons.edit,
                      color: Colors.blue,
                    ),
                    onPressed: widget.onEdit,
                  ),
                  if (widget.onDelete != null)
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: widget.onDelete,
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
