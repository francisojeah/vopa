import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:vopa_app/core/constants/constants.dart';

class ApiService {
  final String apiUrl = 'https://vopa-backend.onrender.com';  

  Future<void> processVoicePayment(String amount) async {
    final url = Uri.parse('$apiUrl/voice-payment');

    try {
      final response = await http.post(
        url,
        headers: _getHeaders(),
        body: jsonEncode({'amount': amount}),
      );

      _handleResponse(response, 'Voice payment');
    } catch (e) {
      print('Error processing voice payment: $e');
    }
  }

  Future<void> processKoraPayment(String amount, String currency, String paymentMethod) async {
    final url = Uri.parse('https://api.kora.com/v1/payments');

    final payload = {
      'amount': amount,
      'currency': currency,
      'paymentMethod': paymentMethod,
    };

    try {
      final response = await http.post(
        url,
        headers: _getKoraHeaders(),
        body: jsonEncode(payload),
      );

      _handleResponse(response, 'Kora payment');
    } catch (e) {
      print('Error processing Kora payment: $e');
    }
  }

  Future<void> createTransaction(Map<String, dynamic> transactionData) async {
    final url = Uri.parse('${AppConstants.apiBaseUrl}/transaction/create');

    try {
      final response = await http.post(
        url,
        headers: _getHeaders(),
        body: jsonEncode(transactionData),
      );

      _handleResponse(response, 'Transaction creation');
    } catch (e) {
      print('Error creating transaction: $e');
    }
  }

  Future<void> processManualPayment(String amount) async {
    final url = Uri.parse('$apiUrl/manual-payment');

    try {
      final response = await http.post(
        url,
        headers: _getHeaders(),
        body: jsonEncode({'amount': amount}),
      );

      _handleResponse(response, 'Manual payment');
    } catch (e) {
      print('Error processing manual payment: $e');
    }
  }

  Map<String, String> _getHeaders() {
    return {
      'Content-Type': 'application/json',
      // Add your authorization header if needed
    };
  }

  Map<String, String> _getKoraHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your_kora_api_token', // Replace with your Kora API token
    };
  }

  void _handleResponse(http.Response response, String operation) {
    if (response.statusCode == 200) {
      print('$operation successful: ${response.body}');
    } else {
      print('$operation failed: ${response.body}');
    }
  }
}
