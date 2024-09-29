import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class TransactionHistoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Transaction History')),
      body: FutureBuilder(
        future: Hive.openBox('transactions'),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            var transactionBox = Hive.box('transactions');
            if (transactionBox.isEmpty) {
              return Center(child: Text('No transactions found.'));
            } else {
              return ListView.builder(
                itemCount: transactionBox.length,
                itemBuilder: (context, index) {
                  var transaction = transactionBox.getAt(index);
                  return ListTile(
                    title: Text('Transaction ${transaction['id']}'),
                    subtitle: Text('${transaction['amount']} ${transaction['currency']}'),
                  );
                },
              );
            }
          } else {
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
