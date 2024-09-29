import 'package:speech_to_text/speech_to_text.dart' as stt;

class VoiceService {
  final stt.SpeechToText _speech = stt.SpeechToText();

  Future<String> listenToVoice() async {
    bool available = await _speech.initialize();
    if (available) {
      await _speech.listen();
      return _speech.lastRecognizedWords;
    } else {
      return 'Error: Voice recognition unavailable';
    }
  }
}
