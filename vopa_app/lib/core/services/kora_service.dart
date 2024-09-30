import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

class KoraService {
  Future<String?> getApiKey() async {
    String? apiKey = await storage.read(key: 'kora_api_key');
    if (apiKey == null) {
      throw Exception('API key not found');
    }
    return apiKey;
  }

  Future<void> initiatePayIn(String amount, String currency) async {
    try {
      String? apiKey = await getApiKey();
      final response = await http.post(
        Uri.parse('https://api.kora.com/v1/payins'), // Adjusted endpoint versioning
        headers: _getHeaders(apiKey),
        body: jsonEncode({
          'amount': amount,
          'currency': currency,
        }),
      );

      _handleResponse(response, 'Pay-In');
    } catch (e) {
      print('Exception: $e');
    }
  }

  Future<void> initiatePayout(String amount, String recipient) async {
    try {
      String? apiKey = await getApiKey();
      final response = await http.post(
        Uri.parse('https://api.kora.com/v1/payouts'), // Adjusted endpoint versioning
        headers: _getHeaders(apiKey),
        body: jsonEncode({
          'amount': amount,
          'recipient': recipient,
        }),
      );

      _handleResponse(response, 'Payout');
    } catch (e) {
      print('Exception: $e');
    }
  }

  Future<void> verifyKYC(String userId) async {
    try {
      String? apiKey = await getApiKey();
      final response = await http.post(
        Uri.parse('https://api.kora.com/v1/identity/kyc'), // Adjusted endpoint versioning
        headers: _getHeaders(apiKey),
        body: jsonEncode({'user_id': userId}),
      );

      _handleResponse(response, 'KYC Verification');
    } catch (e) {
      print('Exception: $e');
    }
  }

  Map<String, String> _getHeaders(String? apiKey) {
    return {
      'Authorization': 'Bearer $apiKey',
      'Content-Type': 'application/json',
    };
  }

  void _handleResponse(http.Response response, String operation) {
    if (response.statusCode == 200) {
      final responseBody = jsonDecode(response.body);
      print('$operation Successful: $responseBody');
    } else {
      print('$operation failed: ${response.statusCode} - ${response.body}');
    }
  }
}
