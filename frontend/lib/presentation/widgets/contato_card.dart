import 'package:flutter/material.dart';

class ContatoCard extends StatefulWidget {
  final Map<String, dynamic> contato;
  final VoidCallback onEdit;
  final VoidCallback? onDelete;
  final IconData? editIcon;

  final void Function(int contatoId, int emailId)? onDeleteEmail;
  final void Function(
    Map<String, dynamic> contato,
    Map<String, dynamic> emailData,
  )?
  onEditEmail;

  const ContatoCard({
    super.key,
    required this.contato,
    required this.onEdit,
    this.onDelete,
    this.editIcon,
    this.onDeleteEmail,
    this.onEditEmail,
  });

  @override
  State<ContatoCard> createState() => _ContatoCardState();
}

class _ContatoCardState extends State<ContatoCard> {
  bool _mostrarDetalhes = false;

  void _alternarDetalhes() {
    setState(() {
      _mostrarDetalhes = !_mostrarDetalhes;
    });
  }

  List<Widget> _buildEmailsPorArea(List<dynamic>? contactEmails) {
    if (contactEmails == null) return [];

    final Map<String, List<Map<String, dynamic>>> emailsPorArea = {};

    for (var item in contactEmails) {
      final area = item['area'] ?? 'Sem área';
      emailsPorArea.putIfAbsent(area, () => []).add(item);
    }

    final areasOrdenadas = emailsPorArea.keys.toList()..sort();
    final List<Widget> widgets = [];

    for (var area in areasOrdenadas) {
      widgets.add(
        Text("$area:", style: const TextStyle(fontWeight: FontWeight.bold)),
      );

      for (var emailObj in emailsPorArea[area]!) {
        widgets.add(
          SizedBox(
            height: 25,
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    overflow: TextOverflow.ellipsis,
                    emailObj['email'] ?? '',
                    style: const TextStyle(fontSize: 14),
                  ),
                ),
                SizedBox(
                  child: GestureDetector(
                    child: Icon(Icons.edit, size: 18, color: Colors.blue),
                    onTap: () {
                      if (widget.onEditEmail != null) {
                        widget.onEditEmail!(widget.contato, emailObj);
                      }
                    },
                  ),
                ),
                GestureDetector(
                  child: Icon(Icons.delete, size: 18, color: Colors.red),
                  onTap: () {
                    if (widget.onDeleteEmail != null &&
                        emailObj['id'] != null &&
                        widget.contato['id'] != null) {
                      widget.onDeleteEmail!(
                        widget.contato['id'],
                        emailObj['id'],
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        );
      }
    }
    return widgets;
  }

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
                    widget.contato['name'] ?? 'Sem nome',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: _alternarDetalhes,
                    label: Text(
                      _mostrarDetalhes ? "Ocultar emails" : "Mostrar emails",
                    ),
                    icon: Icon(
                      _mostrarDetalhes
                          ? Icons.keyboard_arrow_up
                          : Icons.keyboard_arrow_down,
                    ),
                  ),
                  if (_mostrarDetalhes)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: _buildEmailsPorArea(
                        widget.contato['ContactEmails'],
                      ),
                    ),
                ],
              ),
            ),

            // Botões
            SizedBox(
              height: 70,
              child: Column(
                spacing: 14,
                mainAxisSize: MainAxisSize.max,
                children: [
                  GestureDetector(
                    child: Icon(
                      size: 25,
                      widget.editIcon ?? Icons.edit,
                      color: Colors.blue,
                    ),
                    onTap: widget.onEdit,
                  ),
                  if (widget.onDelete != null)
                    GestureDetector(
                      child: const Icon(
                        size: 25,
                        Icons.delete,
                        color: Colors.red,
                      ),
                      onTap: widget.onDelete,
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
