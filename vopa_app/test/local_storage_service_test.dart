// test/local_storage_service_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:vopa_app/core/services/local_storage_service.dart';

void main() {
  test('Check transaction saving functionality', () async {
    final localStorageService = LocalStorageService();
    await localStorageService.init();
    
    var transactionData = {'id': '123', 'amount': '100'};
    await localStorageService.saveTransaction(transactionData);
    
    var transactions = localStorageService.getTransactions();
    expect(transactions.isNotEmpty, true);
  });
}
