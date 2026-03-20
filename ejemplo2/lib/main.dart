import 'package:flutter/material.dart';
import 'pages/splash/splash_app.dart';

// Run | Debug | Profile
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo App',
      theme: ThemeData(primarySwatch: Colors.blue), // ThemeData
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
    ); // MaterialApp
  }
}
