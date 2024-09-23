import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vopa_app/providers/voice_command_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('VOPA - Voice Assistant'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome to VOPA!',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Access the provider and start listening
                Provider.of<VoiceCommandProvider>(context, listen: false).listen();
            },
              child: const Text('Start Voice Command'),
            ),
            Consumer<VoiceCommandProvider>(
                builder: (context, provider, child) {
                    return Text(
                    'Recognized Command: ${provider.text}',
                    style: const TextStyle(fontSize: 18),
                    );
                },
                ),
          ],
        ),
      ),
    );
  }
}
