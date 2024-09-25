import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../services/payment_service.dart';

class VoiceCommandProvider extends ChangeNotifier {
  stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  String _text = "Press the button and start speaking";
  double _confidence = 1.0;
  final PaymentService _paymentService = PaymentService();

  bool get isListening => _isListening;
  String get text => _text;
  double get confidence => _confidence;

  void listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize();
      if (available) {
        _isListening = true;
        _speech.listen(onResult: (val) {
          _text = val.recognizedWords;
          processVoiceCommand(_text);
          if (val.hasConfidenceRating && val.confidence > 0) {
            _confidence = val.confidence;
          }
          notifyListeners();
        });
      } else {
        _isListening = false;
        _speech.stop();
        notifyListeners();
      }
    }
  }

  void stopListening() {
    _isListening = false;
    _speech.stop();
    notifyListeners();
  }

void processVoiceCommand(String command) {
  if (command.toLowerCase().contains('make payment')) {
    // First, prompt for PIN authentication
    Navigator.push(context, MaterialPageRoute(
      builder: (context) => PinScreen(),
    )).then((authenticated) {
      if (authenticated == true) {
        // Continue to payment after successful PIN authentication
        double amount = _extractAmount(command);
        String description = _extractDescription(command);
        _paymentService.initiatePayment('userId123', amount, description).then((success) {
          if (success) {
            print('Payment processed successfully');
          } else {
            print('Payment failed');
          }
        });
      }
    });
  }
}


  double _extractAmount(String command) {
    // Use regular expressions or a voice-to-text NLP service to extract the amount from command
    RegExp regExp = RegExp(r'(\d+)');
    var match = regExp.firstMatch(command);
    if (match != null) {
        return double.parse(match.group(0)!);
    }
    return 0.0;
    }

    String _extractDescription(String command) {
    // Extract description like "groceries", "electricity bill", etc.
        if (command.toLowerCase().contains('groceries')) {
            return 'Groceries Payment';
        } else if (command.toLowerCase().contains('bill')) {
            return 'Bill Payment';
        }
        return 'General Payment';
    }

}
