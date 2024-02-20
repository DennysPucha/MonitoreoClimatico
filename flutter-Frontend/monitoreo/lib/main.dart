import 'package:flutter/material.dart';
import 'package:pis_monitoreo/views/PrincipalPage.dart';
import 'package:pis_monitoreo/views/PronosticoPage.dart';
import 'package:pis_monitoreo/views/exception/Page404.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      // home: const HomePage(),
      initialRoute: '/principal',
      routes: {
        '/principal': (context) => PrincipalPage(),
        '/pronostico': (context) => PronosticoPage(),
      },
      onUnknownRoute: (settings) {
        return MaterialPageRoute(
          builder: (context) => const Page404(),
        );
      },
    );
  }
}
