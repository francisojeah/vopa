import 'package:http/http.dart' as http;
import 'dart:convert';

class PaymentService {
  static const String baseUrl = 'https://api.kora.com/v1/'; // Replace with the correct Kora API URL

  Future<bool> initiatePayment(String userId, double amount, String description) async {
    final url = Uri.parse('${baseUrl}payments'); // Adjust the endpoint to match Kora's API
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // Replace with your API key
      },
      body: json.encode({
        'userId': userId,
        'amount': amount,
        'description': description,
        'paymentMethod': 'USSD/SMS', // Specify method based on user input
      }),
    );

    if (response.statusCode == 200) {
      return true; // Payment successful
    } else {
      print('Error: ${response.body}');
      return false;
    }
  }
}
