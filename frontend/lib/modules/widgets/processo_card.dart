import 'package:flutter/material.dart';
import '../../core/UTILS/lista_textos.dart';

class ProcessoCard extends StatefulWidget {
  final Map<String, dynamic> processo;
  final String contato;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final VoidCallback? onTest;
  final VoidCallback? adicionarRevisao;
  final VoidCallback? processoServidor;
  final IconData? editIcon;
  final IconData? testIcon;
  final IconData? addRevisao;
  final IconData? enviarProcesso;

  const ProcessoCard({
    super.key,
    required this.processo,
    required this.contato,
    required this.onEdit,
    this.processoServidor,
    this.enviarProcesso,
    this.adicionarRevisao,
    this.onTest,
    this.addRevisao,
    this.onDelete,
    this.editIcon,
    this.testIcon,
  });

  final corEditar = Colors.blue;
  final corMaleta = Colors.brown;
  final corCheck = Colors.green;

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
                    widget.processo['processoSider'] ?? 'Sem processo',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(widget.contato),
                  widget.processo['answer'] == true
                      ? GestureDetector(
                          onTap: () {
                            final mensagem =
                                widget.processo['answerMsg'] ?? 'Sem mensagem';
                            showDialog(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Resposta da empresa:'),
                                content: Text(mensagem),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('Fechar'),
                                  ),
                                ],
                              ),
                            );
                          },
                          child: Text(
                            'Respondido (ver mensagem)',
                            style: const TextStyle(color: Colors.blue),
                          ),
                        )
                      : const Text("Não respondido"),

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
                            "Protocolo": widget.processo['protocolo'],
                            'Assunto': widget.processo['subject'],
                            'Area': widget.processo['area'],
                            'Status': widget.processo['contatoStatus'],
                          }),
                        ],
                      ),
                    ),
                ],
              ),
            ),
            // Botões
            SizedBox(
              height: 120,
              width: 80,
              child: GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                mainAxisSpacing: 20,
                crossAxisSpacing: 20,
                children: [
                  IconButton(
                    icon: Icon(
                      widget.editIcon ?? Icons.edit,
                      color: widget.editIcon == Icons.watch_later
                          ? Colors.blue
                          : widget.editIcon == Icons.work
                          ? Colors.brown
                          : widget.editIcon == Icons.check_circle
                          ? Colors.green
                          : Colors.blueGrey, // cor padrão
                    ),
                    onPressed: widget.onEdit,
                  ),
                  if (widget.onDelete != null)
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: widget.onDelete,
                    ),
                  if (widget.onTest != null && widget.testIcon != null)
                    IconButton(
                      onPressed: widget.onTest,
                      icon: Icon(widget.testIcon, color: Colors.green),
                    ),
                  if (widget.adicionarRevisao != null &&
                      widget.addRevisao != null)
                    IconButton(
                      onPressed: widget.adicionarRevisao,
                      icon: Icon(widget.addRevisao, color: Colors.blueGrey),
                    ),
                  if (widget.processoServidor != null &&
                      widget.enviarProcesso != null)
                    IconButton(
                      onPressed: widget.processoServidor,
                      icon: Icon(widget.enviarProcesso, color: Colors.blueGrey),
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
