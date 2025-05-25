String formatarData(String dataIso) {
  try {
    DateTime data = DateTime.parse(dataIso).toLocal();
    return '${data.day.toString().padLeft(2, '0')}/${data.month.toString().padLeft(2, '0')}/${data.year}';
  } catch (e) {
    return '';
  }
}
