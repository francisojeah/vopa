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
      // Extract payment details from voice command and trigger payment
      double amount = _extractAmount(command);
      String description = _extractDescription(command);
      _paymentService.initiatePayment('userId123', amount, description);
      print('Processing payment...');
    }
  }

  double _extractAmount(String command) {
    // Use NLP or regex to extract amount from voice command
    return 100.0; // Dummy amount for now
  }

  String _extractDescription(String command) {
    // Extract payment description from the command
    return 'Payment Description'; // Dummy description
  }
}
