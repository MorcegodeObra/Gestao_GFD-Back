import 'package:flutter/material.dart';
import '../../core/UTILS/lista_textos.dart';

class ProcessoCard extends StatefulWidget {
  final Map<String, dynamic> contato;
  final VoidCallback onEdit;
  final VoidCallback? onDelete;
  final IconData? editIcon;

  const ProcessoCard({
    super.key,
    required this.contato,
    required this.onEdit,
    this.onDelete,
    this.editIcon,
  });

  @override
  State<ProcessoCard> createState() => _ProcessoCardState();
}

class _ProcessoCardState extends State<ProcessoCard> {
  bool _mostrarDetalhes = false;

  void _alternarDetalhes() {
    setState(() {
      _mostrarDetalhes = !_mostrarDetalhes;
    });
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
                    widget.contato['processoSider'] ?? 'Sem processo',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(widget.contato['answer'] == true ? 'Respondido' : 'Sem resposta'),
                  // Botão mostrar/ocultar
                  TextButton.icon(
                    onPressed: _alternarDetalhes,
                    icon: Icon(
                      _mostrarDetalhes
                          ? Icons.keyboard_arrow_up
                          : Icons.keyboard_arrow_down,
                    ),
                    label: Text(
                      _mostrarDetalhes
                          ? 'Ocultar detalhes'
                          : 'Mostrar detalhes',
                    ),
                  ),

                  if (_mostrarDetalhes)
                    Text.rich(
                      TextSpan(
                        children: [
                          ...gerarTextSpan({
                            "Protocolo": widget.contato['protocolo'],
                            'Assunto': widget.contato['subject'],
                            'Area': widget.contato['area'],
                            'Status': widget.contato['contatoStatus'],
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
