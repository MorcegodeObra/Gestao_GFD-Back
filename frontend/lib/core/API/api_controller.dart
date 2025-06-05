import 'package:dio/dio.dart';
import './Models/processos_model.dart';
import './Models/users.dart';
import 'Models/contatos_model.dart';

class ApiService {
  final Dio dio;

  late final Users users;
  late final ProcessosModel processos;
  late final ContatosModel contatos;

  ApiService()
    : dio = Dio(
        BaseOptions(
          baseUrl: 'https://chatbotwhatsapp-z0bc.onrender.com',
          connectTimeout: Duration(seconds: 10),
          receiveTimeout: Duration(seconds: 10),
        ),
      ) {
    // Injeta o Dio compartilhado nos modelos
    users = Users(dio);
    processos = ProcessosModel(dio);
    contatos = ContatosModel(dio);
  }
}
