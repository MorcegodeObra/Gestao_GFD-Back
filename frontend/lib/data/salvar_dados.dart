import 'package:shared_preferences/shared_preferences.dart';

Future<void> salvarDadosUsuario(Map<String, dynamic> user) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('userId', user['id']);
  await prefs.setString('userName', user['userName']);
  await prefs.setString('userEmail', user['userEmail']);
  await prefs.setString('userNumber', user['userNumber']);
}

Future<Map<String, dynamic>> getDadosUsuario() async {
  final prefs = await SharedPreferences.getInstance();
  return {
    'userId': prefs.getInt('userId'),
    'userName': prefs.getString('userName'),
    'userEmail': prefs.getString('userEmail'),
    'userNumber': prefs.getString('userNumber'),
  };
}
