import 'package:flutter/material.dart';
import "./core/modular_form.dart";

main() => runApp(MainApp());

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.blueGrey,
        appBar: AppBar(
          backgroundColor: Colors.grey,
          title: Container(
            width: double.infinity,
            margin: EdgeInsets.all(10),
            child: Text(
              "olá",
              style: TextStyle(fontSize: 40),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        body: Column(
          children: [
            ModularForm(
              titulo: "Cadastro de Contato",
              campos: [
                TextFormField(decoration: InputDecoration(labelText: 'Nome')),
                TextFormField(
                  decoration: InputDecoration(labelText: 'Telefone'),
                ),
              ],
              onSalvar: () {},
            ),
          ],
        ),
      ),
    );
  }
}
