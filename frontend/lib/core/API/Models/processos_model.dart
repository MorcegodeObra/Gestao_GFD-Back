import 'package:dio/dio.dart';
import '../tratamento_erros_api.dart';

class ProcessosModel {
  final Dio dio;

  ProcessosModel(this.dio);

  Future<List<dynamic>> getProcessos({int? userId, int? notUserId}) async {
    try {
      final Map<String, dynamic> queryParams = {};

      if (userId != null) queryParams['userId'] = userId;
      if (notUserId != null) queryParams['notUserId'] = notUserId;

      final response = await dio.get(
        '/processos',
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      return response.data;
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> criarProcessos(Map<String, dynamic> data) async {
    try {
      await dio.post('/processos', data: data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> atualizarProcessos(int id, Map<String, dynamic> data) async {
    try {
      await dio.put('/processos/$id', data: data);
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }

  Future<void> deletarProcessos(int id) async {
    try {
      await dio.delete('/processos/$id');
    } on DioException catch (e) {
      throw CustomException(handleDioError(e));
    }
  }
}
