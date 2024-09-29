import 'package:http/http.dart' as http;

class ApiService {
  Future<void> createTransaction(Map<String, dynamic> transactionData) async {
    final response = await http.post(
      Uri.parse(AppConstants.apiBaseUrl + '/transaction/create'),
      body: transactionData,
    );
    if (response.statusCode == 200) {
      print('Transaction successful');
    } else {
      print('Error creating transaction');
    }
  }
}
