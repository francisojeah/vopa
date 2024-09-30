import 'package:vopa_app/presentation/screens/home_screen.dart';
import 'package:vopa_app/presentation/screens/login_screen.dart';
import 'package:vopa_app/presentation/screens/signup_screen.dart';

import './core/constants/constants.dart';
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VOPA - Voice Payment Assistant',
      initialRoute: AppConstants.loginScreenRoute,
      routes: {
        AppConstants.loginScreenRoute: (context) => LoginScreen(),
        AppConstants.signUpScreenRoute: (context) => SignUpScreen(),
        AppConstants.homeScreenRoute: (context) => HomeScreen(),
      },
    );
  }
}
