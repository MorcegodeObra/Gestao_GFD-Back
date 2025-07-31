import 'package:dio/dio.dart';
import '../tratamento_erros_api.dart';

class ContatosModel {
  final Dio dio;

  ContatosModel(this.dio);

  Future<List<Map<String, dynamic>>> getContatos() async {
    try {
      final response = await dio.get('/contatos');
      return List<Map<String, dynamic>>.from(response.data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<List<Map<String, dynamic>>> getContato(int id) async {
    try {
      final response = await dio.get('/contatos/$id');
      return List<Map<String, dynamic>>.from(response.data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future criarContatos(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/contatos', data: data);
      return response.data;
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future adicionarEmail(int id, List<Map<String, dynamic>> emails) async {
    try {
      await dio.post('/contatos/$id/emails', data: {'emails': emails});
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future editarEmail({
    required int contatoId,
    required int emailId,
    required Map<String, dynamic> emailData,
  }) async {
    try {
      await dio.patch('/contatos/$contatoId/emails/$emailId', data: emailData);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future deletarEmail({required int contatoId, required int emailId}) async {
    try {
      await dio.delete('/contatos/$contatoId/emails/$emailId');
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> atualizarContatos(int id, Map<String, dynamic> data) async {
    try {
      await dio.put('/contatos/$id', data: data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> deletarcontatos(int id) async {
    try {
      await dio.delete('/contatos/$id');
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }
}
