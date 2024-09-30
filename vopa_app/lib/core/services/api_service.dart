import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:vopa_app/core/constants/constants.dart';

class ApiService {
  final String apiUrl = 'https://api.yourservice.com';  // Replace with your actual API base URL

  Future<void> processVoicePayment(String amount) async {
    final url = Uri.parse('$apiUrl/voice-payment');  // Replace with your actual API endpoint for voice payments

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your_api_token',  // Add your authorization header if needed
        },
        body: jsonEncode({'amount': amount}),
      );

      if (response.statusCode == 200) {
        // Handle success
        print('Voice payment successful: ${response.body}');
      } else {
        // Handle server errors
        print('Voice payment failed: ${response.body}');
      }
    } catch (e) {
      // Handle any other errors such as network errors
      print('Error processing voice payment: $e');
    }
  }

  Future<void> processManualPayment(String amount) async {
    final url = Uri.parse('$apiUrl/manual-payment');  // Replace with your actual API endpoint for manual payments

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your_api_token',  // Add your authorization header if needed
        },
        body: jsonEncode({'amount': amount}),
      );

      if (response.statusCode == 200) {
        // Handle success
        print('Manual payment successful: ${response.body}');
      } else {
        // Handle server errors
        print('Manual payment failed: ${response.body}');
      }
    } catch (e) {
      // Handle any other errors such as network errors
      print('Error processing manual payment: $e');
    }
  }
  
  Future<void> createTransaction(Map<String, dynamic> transactionData) async {
    final response = await http.post(
      Uri.parse(AppConstants.apiBaseUrl + '/transaction/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(transactionData),
    );

    if (response.statusCode == 200) {
      print('Transaction successful');
    } else {
      print('Error creating transaction: ${response.body}');
    }
  }
}
