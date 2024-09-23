import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class VoiceCommandProvider extends ChangeNotifier {
  stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  String _text = "Press the button and start speaking";
  double _confidence = 1.0;

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
}
