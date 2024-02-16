import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class informeview extends StatefulWidget {
  @override
  _PageState createState() => _PageState();
}

class _PageState extends State<informeview> {
  List<dynamic> historial = [];
  List<dynamic> reportes = [];
  late DateTime selectedDate = DateTime.now();

  Future<void> consultarAPI() async {
    final DateFormat formatter = DateFormat('yyyy-MM-dd', 'es');
    final String fechaSeleccionada = formatter.format(selectedDate);

    try {
      final http.Response response = await http.get(
        Uri.parse(
          'http://localhost:3000/monitoreo/resumenFecha/reportes?fecha=$fechaSeleccionada',
        ),
      );
      final Map<String, dynamic> data = json.decode(response.body);
      setState(() {
        reportes = [data['data']];
      });
    } catch (error) {
      print('Error al consultar la API para la fecha $fechaSeleccionada: $error');
      setState(() {
        reportes = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Monitoreo Climático'),
        actions: <Widget>[
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              // Lógica para cerrar sesión
            },
          ),
          GestureDetector(
            onTap: () {
              // Navegación a la página de perfil
            },
            child: CircleAvatar(
              backgroundImage: AssetImage('assets/account_circle.png'),
            ),
          ),
        ],
      ),
      body: Container(
        margin: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text(
              'Historial',
              style: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            SizedBox(height: 16.0),
            Row(
              children: <Widget>[
                Text(
                  'Selecciona una fecha: ',
                  style: TextStyle(fontSize: 16.0, color: Colors.white),
                ),
                GestureDetector(
                  onTap: () async {
                    final DateTime? picked = await showDatePicker(
                      context: context,
                      initialDate: selectedDate,
                      firstDate: DateTime(1900),
                      lastDate: DateTime.now(),
                    );
                    if (picked != null && picked != selectedDate) {
                      setState(() {
                        selectedDate = picked;
                      });
                    }
                  },
                  child: Text(
                    DateFormat('dd/MM/yyyy', 'es').format(selectedDate),
                    style: TextStyle(fontSize: 16.0, color: Colors.white),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: consultarAPI,
              child: Text(
                'Buscar',
                style: TextStyle(color: Colors.white),
              ),
            ),
            SizedBox(height: 16.0),
            Expanded(
              child: ListView.builder(
                itemCount: reportes.length,
                itemBuilder: (BuildContext context, int index) {
                  final Map<String, dynamic> reporte = reportes[index];
                  return ListTile(
                    title: Text(
                      DateFormat('yyyy-MM-dd', 'es').format(selectedDate),
                      style: TextStyle(color: Colors.white),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          reporte['datoMasRecurrenteTemperatura'] ?? 'No hay datos',
                          style: TextStyle(color: Colors.white),
                        ),
                        Text(
                          reporte['datoMasRecurrenteHumedad'] ?? 'No hay datos',
                          style: TextStyle(color: Colors.white),
                        ),
                        Text(
                          reporte['datoMasRecurrentePresionAtmosferica'] ?? 'No hay datos',
                          style: TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                    onTap: () {
                      // Navegación al detalle
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
