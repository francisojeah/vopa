import 'package:ussd_service/ussd_service.dart';

class UssdTransactionService {
  Future<void> initiateUssdTransaction(int subscriptionId, String code) async {
    try {
      // Perform the USSD request and get the response
      String response = await UssdService.makeRequest(subscriptionId, code);
      print('USSD Response: $response');
    } catch (e) {
      print('Error: $e');
    }
  }
}
