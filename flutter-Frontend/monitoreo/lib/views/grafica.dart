import 'dart:math';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:monitoreo/controls/servicio_back/FacadeService.dart';

class GraficaClima extends StatefulWidget {
  const GraficaClima({Key? key}) : super(key: key);

  @override
  State<GraficaClima> createState() => _GraficaClimaState();
}

class _GraficaClimaState extends State<GraficaClima> {
  DateTime fechaInicio = DateTime.now().subtract(Duration(days: 14));
  DateTime fechaFin = DateTime.now();
  List<String> tiposDatos = ['TEMPERATURA', 'HUMEDAD', 'PRESION_ATMOSFERICA'];
  String tipoDatoSeleccionado = 'TEMPERATURA';
  Map<String, Map<String, dynamic>> datos = {};

  @override
  void initState() {
    super.initState();
  }

 Future<void> _getDatos() async {
  FacadeService fs = FacadeService();
  var response = await fs.resumenesPorfechas(
      DateFormat('yyyy-MM-dd').format(fechaInicio),
      DateFormat('yyyy-MM-dd').format(fechaFin));
  if (response.code == 200) {
    setState(() {
      datos = Map<String, Map<String, dynamic>>.from(response.datos);
    });
    print(datos);
  } else {
    print(response.msg);
  }
}

  Future<void> _selectFecha(BuildContext context, bool isInicio) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isInicio ? fechaInicio : fechaFin,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != (isInicio ? fechaInicio : fechaFin)) {
      setState(() {
        if (isInicio) {
          fechaInicio = picked;
        } else {
          fechaFin = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Selecciona fechas")),
      body: Center(
        child: Column(

          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text("Gráfica de Datos Climáticos", style: TextStyle(fontSize: 50, fontWeight: FontWeight.bold)),
            const SizedBox(height: 80),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Column(
                  children: [
                    Text(
                      'Fecha de inicio: ${DateFormat('yyyy-MM-dd').format(fechaInicio)}',
                    ),
                    ElevatedButton(
                      onPressed: () => _selectFecha(context, true),
                      child: const Text('Seleccionar fecha de inicio'),
                    ),
                  ],
                ),
                const SizedBox(width: 20),
                Column(
                  children: [
                    Text(
                      'Fecha de fin: ${DateFormat('yyyy-MM-dd').format(fechaFin)}',
                    ),
                    ElevatedButton(
                      onPressed: () => _selectFecha(context, false),
                      child: const Text('Seleccionar fecha de fin'),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _getDatos,
              child: const Text('Obtener datos'),
            ),
            const SizedBox(height: 20),
            DropdownButton<String>(
              value: tipoDatoSeleccionado,
              items: tiposDatos.map((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
              onChanged: (String? newValue) {
                setState(() {
                  tipoDatoSeleccionado = newValue!;
                });
              },
            ),
            const SizedBox(height: 20),
            datos.isNotEmpty
                ? SizedBox(
                    height: 500,
                    width: 700,
                    child: LineChart(
                      LineChartData(
                        backgroundColor: Color(0xff37434d),
                        lineBarsData: [
                          LineChartBarData(
                            spots: datos.entries.map((entry) {
                              final date = entry.key;
                              final data = entry.value;
                              return FlSpot(
                                DateFormat('yyyy-MM-dd')
                                    .parse(date)
                                    .millisecondsSinceEpoch
                                    .toDouble(),
                                data[tipoDatoSeleccionado] ?? 0,
                              );
                            }).toList(),
                            isCurved: true,
                            color: Colors.blueAccent,
                            
                            belowBarData: BarAreaData(show: false),
                            dotData: FlDotData(show: true),
                          ),
                        ],
                        borderData: FlBorderData(show: true),
                        titlesData: FlTitlesData(
                          topTitles: AxisTitles(
                            sideTitles: getBottomTitles(datos, tipoDatoSeleccionado), 
                          ),
                          bottomTitles: AxisTitles(
                            sideTitles: getBottomTitles(datos, tipoDatoSeleccionado),
                          ),
                        ),
                        
                      ),
                    ),
                  )
                : const SizedBox(),
          ],
        ),
      ),
    );
  }
}

SideTitles getBottomTitles(  Map<String, Map<String, dynamic>> datos, String tipoDatoSeleccionado) {
  List<String> fechas = datos.keys.toList();
  List<String> fechasFiltradas = [];

  // Filtrar las fechas que tienen datos para el tipo seleccionado
  for (String fecha in fechas) {
    if (datos[fecha]!.containsKey(tipoDatoSeleccionado)) {
      fechasFiltradas.add(fecha);
    }
  }
  print("siuu si entra");
  print(fechasFiltradas);

  return SideTitles(
    showTitles: true,
    getTitlesWidget: (value, titleMeta) {
      return Text("");
    },
  );
}