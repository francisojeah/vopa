import 'package:flutter/material.dart';

import '../../core/services/api_service.dart';

class PaymentScreen extends StatefulWidget {
  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _amountController = TextEditingController();
  bool _isVoiceEnabled = false;

  void _toggleVoice() {
    setState(() {
      _isVoiceEnabled = !_isVoiceEnabled;
    });
  }

  void _submitPayment() async {
  String amount = _amountController.text;
  
  if (_isVoiceEnabled) {
    // Call the voice processing API
    await ApiService().processVoicePayment(amount);
  } else {
    // Call the manual payment API
    await ApiService().processManualPayment(amount);
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Make a Payment'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Enter Amount'),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                hintText: 'Amount',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),
            SwitchListTile(
              title: Text('Enable Voice Command'),
              value: _isVoiceEnabled,
              onChanged: (value) => _toggleVoice(),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submitPayment,
              child: Text('Proceed to Payment'),
            ),
          ],
        ),
      ),
    );
  }
}
