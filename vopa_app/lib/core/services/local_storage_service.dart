import 'package:hive/hive.dart';

class LocalStorageService {
  late Box _transactionBox;

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
        // Implement server syncing logic
        await sendToServer(transaction);
        // After syncing, remove the local transaction
        await _transactionBox.delete(transaction['id']);
      }
    }
  }

  Future<void> sendToServer(Map<String, dynamic> transaction) async {
    // Add API call to send data to the server
  }

  Future<bool> isOnline() async {
    // Implement a check to see if the app is online
    return true;
  }
}
