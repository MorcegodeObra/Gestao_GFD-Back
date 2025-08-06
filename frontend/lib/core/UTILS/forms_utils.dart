import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class FormUtils {
  static bool isDateField(Map<String, dynamic> campo) {
    return campo['type'] == 'date';
  }

  static String formatDateToDisplay(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  static DateTime? parseDateFromDisplay(String value) {
    try {
      return DateFormat('dd/MM/yyyy').parse(value);
    } catch (_) {
      return null;
    }
  }

  static String formatDateToBackend(DateTime date) {
    return date.toIso8601String();
  }

  static Future<void> pickDate({
    required BuildContext context,
    required TextEditingController controller,
  }) async {
    DateTime initialDate =
        parseDateFromDisplay(controller.text) ?? DateTime.now();

    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (pickedDate != null) {
      controller.text = formatDateToDisplay(pickedDate);
    }
  }
}
