import 'package:flutter/material.dart';
// import 'package:flutter_voice_auth/flutter_voice_auth.dart';

class VoiceAuthScreen extends StatefulWidget {
  @override
  _VoiceAuthScreenState createState() => _VoiceAuthScreenState();
}

class _VoiceAuthScreenState extends State<VoiceAuthScreen> {
  bool _isAuthenticated = false;

  Future<void> authenticate() async {
    // bool success = await FlutterVoiceAuth.authenticate();
    bool success = true;
    setState(() {
      _isAuthenticated = success;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Voice Authentication')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_isAuthenticated ? 'Authenticated' : 'Not Authenticated'),
            ElevatedButton(
              onPressed: authenticate,
              child: Text('Authenticate via Voice'),
            ),
          ],
        ),
      ),
    );
  }
}
