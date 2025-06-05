import 'package:dio/dio.dart';

class CustomException implements Exception {
  final String message;

  CustomException(this.message);

  @override
  String toString() => message;
}

class ApiService {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'https://chatbotwhatsapp-z0bc.onrender.com',
      connectTimeout: Duration(seconds: 10),
      receiveTimeout: Duration(seconds: 10),
    ),
  );

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
      throw CustomException(_handleDioError(e));
    }
  }

  Future<void> criarProcessos(Map<String, dynamic> data) async {
    try {
      await dio.post('/processos', data: data);
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  Future<void> atualizarProcessos(int id, Map<String, dynamic> data) async {
    try {
      await dio.put('/processos/$id', data: data);
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  Future<void> deletarProcessos(int id) async {
    try {
      await dio.delete('/processos/$id');
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  Future<void> criarUsuario(Map<String, dynamic> data) async {
    try {
      await dio.post('/users', data: data);
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  Future<void> atualizarUsuario(int id, Map<String, dynamic> data) async {
    try {
      await dio.put('/users/$id', data: data);
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> data) async {
    try {
      final response = await dio.post('/login', data: data);
      return response.data;
    } on DioException catch (e) {
      throw CustomException(_handleDioError(e));
    }
  }

  String _handleDioError(DioException e) {
    if (e.response != null) {
      final data = e.response?.data;

      if (data is Map<String, dynamic>) {
        if (data.containsKey('error')) {
          return data['error'];
        } else if (data.containsKey('message')) {
          return data['message'];
        }
      }

      return 'Erro do servidor: ${e.response?.statusCode}';
    } else {
      return 'Erro de conexão: ${e.message}';
    }
  }
}
