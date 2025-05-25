import 'package:flutter/material.dart';

List<TextSpan> gerarTextSpan(Map<String, dynamic> dados) {
  return dados.entries.map((entry) {
    return TextSpan(
      text: '${entry.key}: ${entry.value ?? ''}\n',
    );
  }).toList();
}