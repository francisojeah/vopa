import 'package:telephony/telephony.dart';

class SmsTransactionService {
  final Telephony telephony = Telephony.instance;

  Future<void> sendPayment(String phoneNumber, String amount) async {
    final bool? permissionGranted = await telephony.requestSmsPermissions;
    
    if (permissionGranted != null && permissionGranted) {
      telephony.sendSms(
        to: phoneNumber,
        message: 'PAY $amount',
      );
      print("SMS sent to $phoneNumber");
    } else {
      print("SMS permission not granted");
    }
  }
}
