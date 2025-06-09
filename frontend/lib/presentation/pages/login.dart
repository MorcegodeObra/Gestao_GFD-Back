import 'package:flutter/material.dart';
import './services/login_service.dart'; // Ajuste conforme sua estrutura

class LoginPage extends StatefulWidget {
  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final senhaController = TextEditingController();
  bool isLoading = false;

  @override
  void dispose() {
    emailController.dispose();
    senhaController.dispose();
    super.dispose();
  }

  void setLoading(bool value) {
    setState(() {
      isLoading = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(centerTitle: true, title: Text("GESTÃO FAIXA DE DOMINIO")),
      body: Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Column(
              spacing: 14,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset('assets/der.png', height: 150),
                    const SizedBox(width: 16),
                    Image.asset('assets/simemp.png', height: 150),
                  ],
                ),
                TextField(
                  controller: emailController,
                  decoration: InputDecoration(labelText: "Email"),
                ),
                TextField(
                  controller: senhaController,
                  decoration: InputDecoration(labelText: "Senha"),
                  obscureText: true,
                ),
                isLoading
                    ? CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: () {
                          login(
                            context: context,
                            emailController: emailController,
                            senhaController: senhaController,
                            setloading: setLoading,
                          );
                        },
                        child: Text('Login'),
                      ),
                GestureDetector(
                  onTap: () {
                    Navigator.pushNamed(context, "/cadastro");
                  },
                  child: Text("Clique aqui para criar sua conta", style: TextStyle(color: Colors.blue),),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
