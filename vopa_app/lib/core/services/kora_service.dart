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
        Uri.parse('https://api.kora.com/payins'),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'amount': amount,
          'currency': currency,
        }),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        print('Pay-In Successful: $responseBody');
      } else {
        print('Error: ${response.body}');
      }
    } catch (e) {
      print('Exception: $e');
    }
  }

  Future<void> initiatePayout(String amount, String recipient) async {
    try {
      String? apiKey = await getApiKey();
      final response = await http.post(
        Uri.parse('https://api.kora.com/payouts'),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'amount': amount,
          'recipient': recipient,
        }),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        print('Payout Successful: $responseBody');
      } else {
        print('Error: ${response.body}');
      }
    } catch (e) {
      print('Exception: $e');
    }
  }

  Future<void> verifyKYC(String userId) async {
    try {
      String? apiKey = await getApiKey();
      final response = await http.post(
        Uri.parse('https://api.kora.com/identity/kyc'),
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'user_id': userId}),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        print('KYC Verification Successful: $responseBody');
      } else {
        print('Error: ${response.body}');
      }
    } catch (e) {
      print('Exception: $e');
    }
  }
}
