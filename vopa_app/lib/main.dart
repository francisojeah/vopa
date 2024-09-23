import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'screens/home_screen.dart';
import 'providers/voice_command_provider.dart';

void main() async {
  // Initialize Hive for offline storage
  await Hive.initFlutter();

  // Run the app
  runApp(const VopaApp());
}

class VopaApp extends StatelessWidget {
  const VopaApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => VoiceCommandProvider()),
      ],
      child: MaterialApp(
        title: 'VOPA - Voice Payment Assistant',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
