import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class HomeScreen extends StatelessWidget {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await _auth.signOut();
              Navigator.pushReplacementNamed(context, '/'); // Navigate back to the login screen
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Welcome to VOPA!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              'Your payment assistant for a seamless experience.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 40),
            ElevatedButton(
              onPressed: () {
                // Navigate to Payment functionality
                // For example: Navigator.push(context, MaterialPageRoute(builder: (context) => PaymentScreen()));
              },
              child: Text('Make a Payment'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigate to Transaction History functionality
                // For example: Navigator.push(context, MaterialPageRoute(builder: (context) => TransactionHistoryScreen()));
              },
              child: Text('View Transaction History'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Navigate to Profile or Settings
                // For example: Navigator.push(context, MaterialPageRoute(builder: (context) => ProfileScreen()));
              },
              child: Text('Profile Settings'),
            ),
          ],
        ),
      ),
    );
  }
}
