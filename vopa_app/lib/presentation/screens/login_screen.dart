import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:vopa_app/core/constants/constants.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> _loginUser() async {
    try {
      await _auth.signInWithEmailAndPassword(
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );
      Navigator.pushNamed(context, AppConstants.homeScreenRoute);
    } catch (e) {
      String errorMessage;
      if (e is FirebaseAuthException) {
        switch (e.code) {
          case 'user-not-found':
            errorMessage = 'No user found with that email.';
            break;
          case 'wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
      } else {
        errorMessage = 'An error occurred. Please try again later.';
      }
      // Show error message to user
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
                controller: emailController,
                decoration: InputDecoration(hintText: 'Email')),
            TextField(
                controller: passwordController,
                decoration: InputDecoration(hintText: 'Password')),
            SizedBox(height: 20),
            ElevatedButton(onPressed: _loginUser, child: Text('Login')),
          ],
        ),
      ),
    );
  }
}
