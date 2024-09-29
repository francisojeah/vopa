import 'package:ussd_service/ussd_service.dart';

class UssdTransactionService {
  Future<void> initiateUssdTransaction(String code) async {
    try {
      String response = await UssdService.sendUssd(code);
      print('USSD Response: $response');
    } catch (e) {
      print('Error: $e');
    }
  }
}
