import 'package:flutter/material.dart';
import 'package:frontend/presentation/widgets/processo_card.dart';
import '../../widgets/modular_form.dart';
import '../../widgets/delete_dialog.dart';

class MainMenu extends StatefulWidget {
  final int? userId;
  final List<dynamic> processos;
  final List<dynamic> contatos;
  final void Function(int, Map<String, dynamic>) atualizarProcessos;
  final VoidCallback carregarDados;
  final void Function(Map<String, dynamic>) criarProcesso;
  final void Function(int, Map<String, dynamic>) aceitarEnvioProcesso;
  final void Function(int) deletarProcesso;
  final bool isLoading;

  const MainMenu({
    super.key,
    required this.userId,
    required this.processos,
    required this.contatos,
    required this.atualizarProcessos,
    required this.aceitarEnvioProcesso,
    required this.carregarDados,
    required this.criarProcesso,
    required this.deletarProcesso,
    required this.isLoading,
  });

  @override
  State<MainMenu> createState() => _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  String? statusSelecionado;
  bool respondidoSelecionado = false;
  bool mostrarApenasAtrasados = false;
  final TextEditingController _searchController = TextEditingController();
  String termoBusca = '';

  Widget _buildFiltroRespondidoButton() {
    final bool isRespondido = respondidoSelecionado == true;

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isRespondido ? Colors.blue : Colors.orange,
        foregroundColor: Colors.white,
        textStyle: const TextStyle(fontSize: 12),
      ),
      onPressed: () {
        setState(() {
          respondidoSelecionado = !isRespondido;
        });
      },
      child: Text(isRespondido ? "R" : "N.R"),
    );
  }

  Widget _buildFiltroAtrasadoButton() {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: mostrarApenasAtrasados ? Colors.blue : Colors.green,
        padding: EdgeInsets.zero,
        foregroundColor: Colors.white,
        textStyle: const TextStyle(fontSize: 12),
      ),
      onPressed: () {
        setState(() {
          mostrarApenasAtrasados = !mostrarApenasAtrasados;
        });
      },
      child: Text(mostrarApenasAtrasados ? "Atrasados" : "Em dia"),
    );
  }

  void abrirFormulario({Map<String, dynamic>? processos}) {
    final contatosDropdown = widget.contatos.map((contato) {
      return {
        'label': contato['name'] ?? 'Sem nome',
        'value': contato['id'].toString(), // <-- converte para String
      };
    }).toList();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => ModularFormDialog(
        titulo: processos == null ? 'Novo Processo' : 'Editar Processo',
        dataInicial: processos,
        camposTexto: [
          {'label': 'Processo Sider', 'key': 'processoSider'},
          {'label': 'Protocolo', 'key': 'protocolo'},
          {'label': 'Assunto', 'key': 'subject'},
          {'label': 'Ultimo contato', 'key': 'lastSent', "type": "date"},
          {'label': 'Rodovia', 'key': 'rodovia'},
        ],
        camposDropdown: [
          {'label': 'Contato', 'key': 'contatoId', 'itens': contatosDropdown},
          {
            'label': 'Prioridade',
            'key': 'priority',
            'itens': [
              {'label': 'Baixo', 'value': 'BAIXO'},
              {'label': 'Médio', 'value': 'MÉDIO'},
              {'label': 'Alto', 'value': 'ALTO'},
              {'label': 'Urgente', 'value': 'URGENTE'},
            ],
          },
          {
            'label': 'Area',
            'key': 'area',
            'itens': [
              {'label': 'AREA 1', 'value': 'AREA 1'},
              {'label': 'AREA 2', 'value': 'AREA 2'},
              {'label': 'AREA 3', 'value': 'AREA 3'},
              {'label': 'AREA 4', 'value': 'AREA 4'},
              {'label': 'AREA 5', 'value': 'AREA 5'},
            ],
          },
          {
            'label': 'Status',
            'key': 'contatoStatus',
            'itens': [
              {'label': 'REVISÃO DE PROJETO', 'value': 'REVISÃO DE PROJETO'},
              {'label': 'IMPLANTAÇÃO', 'value': 'IMPLANTAÇÃO'},
              {'label': 'VISTORIA INICIAL', 'value': 'VISTORIA INICIAL'},
              {'label': 'VISTORIA FINAL', 'value': 'VISTORIA FINAL'},
              {'label': 'ASSINATURAS', 'value': 'ASSINATURAS'},
              {'label': 'AGUARDANDO DER', 'value': 'AGUARDANDO DER'},
              {'label': 'CANCELADO/ARQUIVADO', 'value': 'CANCELADO/ARQUIVADO'},
            ],
          },
          {
            "label": "Respondido",
            "key": "answer",
            "itens": [
              {"label": "Sim", "value": "true"},
              {"label": "Não", "value": "false"},
            ],
          },
        ],
        onSubmit: (data) async {
          data['userId'] = widget.userId;
          if (processos == null) {
            widget.criarProcesso(data);
          } else {
            widget.atualizarProcessos(processos['id'], data);
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final processosFiltradosFila = widget.processos
        .where(
          (p) => p['answer'] == true && p['userId'] == widget.userId,
        )
        .toList();

    final prioridadeOrdem = {"URGENTE": 0, "ALTO": 1, "MÉDIO": 2, "BAIXO": 3};

    final corPorPrioridade = {
      "URGENTE": Colors.red.shade300,
      "ALTO": Colors.orange.shade300,
      "MÉDIO": Colors.yellow.shade300,
      "BAIXO": Colors.green.shade300,
    };

    processosFiltradosFila.sort((a, b) {
      final prioridadeA = prioridadeOrdem[a['priority']] ?? 999;
      final prioridadeB = prioridadeOrdem[b['priority']] ?? 999;

      if (prioridadeA != prioridadeB) {
        return prioridadeA.compareTo(
          prioridadeB,
        ); // menor número = maior prioridade
      }

      final dateA = DateTime.tryParse(a['answerDate'] ?? '') ?? DateTime(1900);
      final dateB = DateTime.tryParse(b['answerDate'] ?? '') ?? DateTime(1900);
      return dateA.compareTo(dateB); // se prioridade igual, compara por data
    });
    final Map<int, String> mapaContatos = {
      for (var contato in widget.contatos)
        contato["id"] as int: (contato['name'] ?? "Desconhecido").toString(),
    };

    final processosFiltrados = widget.processos.where((p) {
      final status = p['contatoStatus'];
      final processo = p['processoSider']?.toString().toLowerCase() ?? '';
      final userId = p['userId'];
      final matchesBusca = processo.contains(termoBusca);
      final matchesStatus =
          statusSelecionado == null || status == statusSelecionado;
      final matchesUser = widget.userId == null || userId == widget.userId;
      final respondidoOk =
          (respondidoSelecionado == true && p['answer'] == true) ||
          (respondidoSelecionado == false && p['answer'] == false);

      final String? lastInterationString = p['lastInteration'];
      final DateTime? lastInteraction = lastInterationString != null
          ? DateTime.tryParse(lastInterationString)
          : null;
      final bool estaAtrasado =
          lastInteraction != null &&
          DateTime.now().difference(lastInteraction).inDays > 30;

      final matchesAtraso = !mostrarApenasAtrasados || estaAtrasado;

      return matchesBusca &&
          matchesStatus &&
          matchesUser &&
          respondidoOk &&
          matchesAtraso;
    }).toList();

    final Set<String> statusDisponiveis = widget.processos
        .map((p) => p['contatoStatus'] as String?)
        .where((s) => s != null)
        .toSet()
        .cast<String>();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: widget.isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: [
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      labelText: "Buscar por processo",
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {
                        termoBusca = value.toLowerCase();
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _buildFiltroRespondidoButton(),
                      _buildFiltroAtrasadoButton(),
                      DropdownButton<String>(
                        value: statusSelecionado,
                        hint: const Text("Filtrar por status"),
                        onChanged: (String? novoStatus) {
                          setState(() {
                            statusSelecionado = (novoStatus == 'TODOS')
                                ? null
                                : novoStatus;
                          });
                        },
                        items: [
                          const DropdownMenuItem(
                            value: 'TODOS',
                            child: Text("Todos"),
                          ),
                          ...statusDisponiveis.map(
                            (status) => DropdownMenuItem(
                              value: status,
                              child: Text(status),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Text(
                    "Fila de atendimento:",
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: processosFiltradosFila.map<Widget>((p) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color:
                                corPorPrioridade[p['priority']] ??
                                Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            children: [
                              Text(
                                p['processoSider'] ?? 'Sem ID',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                p['contatoStatus'] ?? 'Sem Status',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  Expanded(
                    child: processosFiltrados.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(
                                  Icons.folder_off,
                                  size: 64,
                                  color: Colors.grey,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  "Nenhum processo encontrado!",
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : Column(
                            children: [
                              Expanded(
                                child: ListView(
                                  children: processosFiltrados.map((processos) {
                                    final contatoId = processos['contatoId'];
                                    final nomeContato =
                                        mapaContatos[contatoId] ??
                                        "Desconhecido";
                                    final bool processoAguardando =
                                        processos["solicitacaoProcesso"] ==
                                        true;

                                    return ProcessoCard(
                                      processo: processos,
                                      contato: nomeContato,
                                      editIcon: Icons.edit,
                                      testIcon: Icons.check,
                                      addRevisao: Icons.addchart_outlined,
                                      enviarProcesso: Icons.cloud_upload,
                                      processoServidor: () async {
                                        showDialog(
                                          context: context,
                                          builder: (context) => ConfirmDeleteDialog(
                                            titulo:
                                                "Confirma o envio do processo?",
                                            mensagem:
                                                "Tem certeza que quer enviar esse processo para o servidor?",
                                            onConfirm: () async {
                                              widget.atualizarProcessos(
                                                processos['id'],
                                                {"userId": 12},
                                              );
                                              setState(() {});
                                            },
                                          ),
                                        );
                                      },
                                      onEdit: () =>
                                          abrirFormulario(processos: processos),
                                      onTest: processoAguardando
                                          ? () async {
                                              final data = {
                                                "userId": widget.userId,
                                              };

                                              showDialog(
                                                context: context,
                                                builder: (context) => ConfirmDeleteDialog(
                                                  titulo:
                                                      "Confirmar envio de processo",
                                                  mensagem:
                                                      "Tem certeza que quer enviar esse processo para outro usuário??",
                                                  onConfirm: () async {
                                                    widget.aceitarEnvioProcesso(
                                                      processos['id'],
                                                      data,
                                                    );
                                                    setState(() {
                                                      Navigator.of(
                                                        context,
                                                      ).pop();
                                                    });
                                                  },
                                                ),
                                              );
                                            }
                                          : null,
                                      onDelete: () => showDialog(
                                        context: context,
                                        builder: (context) => ConfirmDeleteDialog(
                                          titulo: 'Confirmar Exclusão',
                                          mensagem:
                                              'Tem certeza que deseja deletar este Processos?',
                                          onConfirm: () async {
                                            widget.deletarProcesso(
                                              processos['id'],
                                            );
                                            setState(() {
                                              Navigator.of(context).pop();
                                            });
                                          },
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ],
                          ),
                  ),
                ],
              ),
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: "meu_processos",
        backgroundColor: const Color(0xFF28582E),
        onPressed: () => abrirFormulario(),
        child: const Icon(Icons.create_new_folder, color: Colors.white),
      ),
    );
  }
}
