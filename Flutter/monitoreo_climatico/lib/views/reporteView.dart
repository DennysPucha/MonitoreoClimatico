import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class reporteView extends StatefulWidget {
  final Map<String, dynamic> params;

  reporteView({required this.params});

  @override
  _PageState createState() => _PageState();
}

class _PageState extends State<reporteView> {
  late List<dynamic> reportes;
  late double? promedioHumedad;

  @override
  void initState() {
    super.initState();
    reportes = [];
    promedioHumedad = null;
    fetchData();
  }

  Future<void> fetchData() async {
    final fecha = widget.params['fecha'];
    try {
      final response = await obtenerReportesPorFecha(fecha);
      setState(() {
        reportes = response['data'];
        promedioHumedad = calcularPromedioHumedad();
      });
      print(response);
    } catch (error) {
      print(error);
    }
  }

  double? calcularPromedioHumedad() {
    if (reportes.isEmpty) {
      return null;
    }

    final humedadReports = reportes.where((reporte) => reporte['tipo_dato'] == 'HUMEDAD');
    if (humedadReports.isEmpty) {
      return null;
    }

    final sumaHumedad = humedadReports.fold(0.0, (sum, reporte) => sum + double.parse(reporte['dato']));
    final promedioHumedad = sumaHumedad / humedadReports.length;

    return double.parse(promedioHumedad.toStringAsFixed(2));
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
              'Reporte del día',
              style: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            SizedBox(height: 16.0),
            promedioHumedad != null
                ? Text(
                    'Promedio del día : ${promedioHumedad.toString()}%',
                    style: TextStyle(fontFamily: 'Tahoma, sans-serif', fontWeight: FontWeight.bold, color: Colors.white),
                  )
                : Container(),
            SizedBox(height: 16.0),
            reportes.isNotEmpty
                ? Expanded(
                    child: ListView.builder(
                      itemCount: reportes.length,
                      itemBuilder: (BuildContext context, int index) {
                        final reporte = reportes[index];
                        return ListTile(
                          title: Text(reporte['hora_registro'], style: TextStyle(color: Colors.white)),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: <Widget>[
                              Text(reporte['dato'], style: TextStyle(color: Colors.white)),
                              Text(reporte['tipo_dato'], style: TextStyle(color: Colors.white)),
                            ],
                          ),
                        );
                      },
                    ),
                  )
                : Text(
                    'No hay reporte de ese día en específico',
                    style: TextStyle(color: Colors.white),
                  ),
          ],
        ),
      ),
    );
  }
}

Future<Map<String, dynamic>> obtenerReportesPorFecha(String fecha) async {
  final response = await http.get(Uri.parse('http://localhost:3000/monitoreo/resumenFecha/reportes?fecha=$fecha'));
  return json.decode(response.body);
}
