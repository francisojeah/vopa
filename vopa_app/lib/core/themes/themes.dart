import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    primaryColor: Colors.blue,
    hintColor: Colors.lightBlueAccent,
    brightness: Brightness.light,
    fontFamily: 'Poppins',
    buttonTheme: ButtonThemeData(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18.0)),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    primaryColor: Colors.black,
    hintColor: Colors.tealAccent,
    brightness: Brightness.dark,
    fontFamily: 'Poppins',
  );
}
