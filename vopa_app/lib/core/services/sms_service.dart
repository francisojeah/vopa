import 'package:sms/sms.dart';

class SmsTransactionService {
  Future<void> sendPayment(String phoneNumber, String amount) async {
    SmsSender sender = SmsSender();
    SmsMessage message = SmsMessage(phoneNumber, 'PAY $amount');
    await sender.sendSms(message);
  }
}
