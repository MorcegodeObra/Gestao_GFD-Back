import 'package:flutter/material.dart';
import '../../core/API/api_controller.dart';
import './services/cadastro_service.dart';

class CadastroPage extends StatefulWidget {
  const CadastroPage({super.key});

  @override
  State<CadastroPage> createState() => _CadastroPageState();
}

class _CadastroPageState extends State<CadastroPage> {
  final ApiService apiService = ApiService();

  final TextEditingController nomeController = TextEditingController();
  final TextEditingController numeroController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController senhaController = TextEditingController();
  final List<String> areas = ["AREA 1", "AREA 2", "AREA 3", "AREA 4", "AREA 5"];
  final List<String> cargos = ["ENGENHEIRO", "TÉCNICO", "COORDENADOR"];
  String? areaSelecionada;
  String? cargoSelecionado;

  bool isLoading = false;

  void setLoading(bool value) {
    setState(() {
      isLoading = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cadastro')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: nomeController,
              decoration: const InputDecoration(labelText: 'Nome'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: numeroController,
              decoration: const InputDecoration(labelText: 'Número (WhatsApp)'),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: senhaController,
              decoration: const InputDecoration(labelText: 'Senha'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Área'),
              value: areaSelecionada,
              items: areas.map((area) {
                return DropdownMenuItem<String>(value: area, child: Text(area));
              }).toList(),
              onChanged: (valor) {
                setState(() {
                  areaSelecionada = valor;
                });
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Cargo'),
              value: cargoSelecionado,
              items: cargos.map((cargo) {
                return DropdownMenuItem<String>(
                  value: cargo,
                  child: Text(cargo),
                );
              }).toList(),
              onChanged: (valor) {
                setState(() {
                  cargoSelecionado = valor;
                });
              },
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: isLoading
                  ? null
                  : () async {
                      await cadastrar(
                        context: context,
                        nomeController: nomeController,
                        numeroController: numeroController,
                        emailController: emailController,
                        senhaController: senhaController,
                        areaSelecionada: areaSelecionada,
                        cargoSelecionado: cargoSelecionado,
                        setloading: setLoading,
                      );
                    },
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Cadastrar'),
            ),
          ],
        ),
      ),
    );
  }
}
