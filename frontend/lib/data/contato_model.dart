import 'package:drift/drift.dart';

@DataClassName('Contato')
class Contatos extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get nome => text()();
  TextColumn get telefone => text()();
  TextColumn get email => text()();
  DateTimeColumn get updatedAt => dateTime()();
  IntColumn get lastUserId => integer()();
}
