import 'package:dio/dio.dart';
import '../tratamento_erros_api.dart';

class Users {
  final Dio dio;

  Users(this.dio);
  Future<void> criarUsuario(Map<String, dynamic> data) async {
    try {
      await dio.post('/users', data: data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> atualizarUsuario(int id, Map<String, dynamic> data) async {
    try {
      await dio.put('/users/$id', data: data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/login', data: data);
      return response.data;
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }
}
