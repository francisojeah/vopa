import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

class VoiceCommandScreen extends StatefulWidget {
  @override
  _VoiceCommandScreenState createState() => _VoiceCommandScreenState();
}

class _VoiceCommandScreenState extends State<VoiceCommandScreen> {
  late stt.SpeechToText _speech;
  bool _isListening = false;
  String _text = 'Press the mic and speak';

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
  }

  void _listen() async {
    if (!_isListening) {
      bool available = await _speech.initialize();
      if (available) {
        setState(() => _isListening = true);
        _speech.listen(onResult: (val) => setState(() {
          _text = val.recognizedWords;
        }));
      }
    } else {
      setState(() => _isListening = false);
      _speech.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Voice Assistant')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_text),
            IconButton(
              icon: Icon(Icons.mic),
              onPressed: _listen,
            ),
          ],
        ),
      ),
    );
  }
}
