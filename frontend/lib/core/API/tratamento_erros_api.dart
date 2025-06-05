import 'package:dio/dio.dart';

String handleDioError(DioException e) {
  if (e.response != null) {
    final data = e.response?.data;

    if (data is Map<String, dynamic>) {
      if (data.containsKey('error')) {
        return data['error'];
      } else if (data.containsKey('message')) {
        return data['message'];
      }
    }

    return 'Erro do servidor';
  } else {
    return 'Erro de conexão: ${e.message}';
  }
}

class CustomException implements Exception {
  final String message;

  CustomException(this.message);

  /// Construtor de fábrica que cria um CustomException a partir de um DioException
  factory CustomException.fromDio(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return CustomException("Servidor offline. Tente novamente mais tarde.");
    }

    if (e.response != null && e.response?.data != null) {
      final data = e.response?.data;
      // Se o backend enviar uma mensagem de erro personalizada:
      if (data is Map && data['message'] != null) {
        return CustomException(data['message'].toString());
      }
    }

    return CustomException(e.message ?? "Erro inesperado");
  }

  @override
  String toString() => message;
}
