import 'package:intl/intl.dart';

String formatarData(String? data) {
  if (data == null || data.isEmpty) return 'Sem data';

  try {
    final date = DateTime.parse(data);
    return DateFormat('dd/MM/yyyy').format(date);
  } catch (_) {
    return 'Data inválida';
  }
}
