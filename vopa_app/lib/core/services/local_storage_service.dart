import 'package:hive/hive.dart';

class LocalStorageService {
  Box _transactionBox;

  Future<void> init() async {
    _transactionBox = await Hive.openBox('transactions');
  }

  Future<void> saveTransaction(Map<String, dynamic> transactionData) async {
    await _transactionBox.add(transactionData);
  }

  List<Map<String, dynamic>> getTransactions() {
    return List<Map<String, dynamic>>.from(_transactionBox.values);
  }

  Future<void> syncTransactionsToServer() async {
    if (await isOnline()) {
      var transactions = getTransactions();
      for (var transaction in transactions) {
        // Send transaction data to backend API
        // Remove from local storage after syncing
      }
    }
  }
}
