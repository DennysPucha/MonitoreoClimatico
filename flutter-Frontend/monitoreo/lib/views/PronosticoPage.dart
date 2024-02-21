import 'package:flutter/material.dart';
import 'package:monitoreo/controls/servicio_back/FacadeService.dart';
import 'package:monitoreo/controls/servicio_back/RespuestaGenerica.dart';
import 'package:monitoreo/views/componentes/Menu.dart';

import 'package:fl_chart/fl_chart.dart';

class PronosticoPage extends StatefulWidget {
  @override
  _PronosticoPageState createState() => _PronosticoPageState();
}

class _PronosticoPageState extends State<PronosticoPage> {
  List<Map<String, dynamic>> pronostico = [];
  String selectedDate = "2024-02-20"; // Fecha inicial
  String selectedTipoDato = "TEMPERATURA"; // Tipo de pronóstico inicial

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    traerRangos(selectedTipoDato, selectedDate);
  }

  Future<void> traerRangos(String tipoPronostico, String fecha) async {
    try {
      FacadeService servicio = FacadeService();
      RespuestaGenerica value =
          await servicio.buscarFecha(tipoPronostico, fecha);

      print(value.datos);
      if (value.code == 200) {
        setState(() {
          pronostico = List<Map<String, dynamic>>.from(value.datos);
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error ${value.code}'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error $e'),
        ),
      );
    }
  }

  Widget getMeasurementWidget(String tipoDato, double valor) {
    String label = '';
    Icon icon;

    switch (tipoDato) {
      case "TEMPERATURA":
        if (valor < 10) {
          icon = Icon(Icons.ac_unit, color: Colors.blue); // Frío
          label = 'Frío';
        } else if (valor >= 10 && valor < 25) {
          icon = Icon(Icons.wb_sunny, color: Colors.orange); // Templado
          label = 'Templado';
        } else {
          icon = Icon(Icons.hot_tub, color: Colors.red); // Calor
          label = 'Calor';
        }
        break;
      case "PRESION_ATMOSFERICA":
        if (valor < 1000) {
          icon = Icon(Icons.arrow_downward, color: Colors.blue); // Baja presión
          label = 'Baja';
        } else if (valor >= 1000 && valor < 1013) {
          icon = Icon(Icons.check, color: Colors.green); // Presión normal
          label = 'Presión';
        } else {
          icon = Icon(Icons.arrow_upward, color: Colors.red); // Alta presión
          label = 'Alta';
        }
        break;
      case "HUMEDAD":
        if (valor < 30) {
          icon = Icon(Icons.cloud_off, color: Colors.orange); // Baja humedad
          label = 'Baja ';
        } else if (valor >= 30 && valor <= 60) {
          icon = Icon(Icons.cloud, color: Colors.green); // Humedad normal
          label = 'Normal';
        } else {
          icon = Icon(Icons.cloud, color: Colors.blue); // Alta humedad
          label = 'Alta';
        }
        break;
      default:
        icon =
            Icon(Icons.error, color: Colors.red); // Icono de error por defecto
        break;
    }

    return Column(
      children: [
        icon,
        Text(label),
      ],
    );
  }

 Future<void> _selectDate(BuildContext context) async {
  DateTime? picked;

  picked = await showDatePicker(
    context: context,
    initialDate: DateTime.now(),
    firstDate: DateTime.now(),
    lastDate: DateTime.now().add(Duration(days: 7)),
  );

  if (picked != null) {
    setState(() {
      selectedDate = picked!.toLocal().toString().split(' ')[0];
    });
    traerRangos(selectedTipoDato, selectedDate);
  }
}

  Future<void> _selectTipoDato(BuildContext context) async {
    String? tipoSeleccionado = await showDialog<String?>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Selecciona el Tipo de Pronóstico'),
          content: Column(
            children: [
              // Agrega aquí tus opciones de tipo de pronóstico
              ListTile(
                title: Text('TEMPERATURA'),
                onTap: () {
                  Navigator.pop(context, 'TEMPERATURA');
                },
              ),
              ListTile(
                title: Text('HUMEDAD'),
                onTap: () {
                  Navigator.pop(context, 'HUMEDAD');
                },
              ),
              ListTile(
                title: Text('PRESION'),
                onTap: () {
                  Navigator.pop(context, 'PRESION_ATMOSFERICA');
                },
              ),
            ],
          ),
        );
      },
    );

    if (tipoSeleccionado != null) {
      setState(() {
        selectedTipoDato = tipoSeleccionado!;
      });
      traerRangos(selectedTipoDato, selectedDate);
    }
  }

  void _showGraphModal(BuildContext context, List<double> data) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          height: 500,
          padding: EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            color: Colors.white,
          ),
          child: LineChart(
            LineChartData(
              lineBarsData: [
                LineChartBarData(
                  spots: List.generate(
                    data.length,
                    (index) => FlSpot(index.toDouble(), data[index]),
                  ),
                  isCurved: false,
                  colors: [
                    Colors.blueAccent
                  ], // Puedes personalizar el color de la línea
                  belowBarData: BarAreaData(show: false),
                  dotData: FlDotData(show: false),
                  barWidth: 4,
                ),
              ],
              titlesData: FlTitlesData(
                leftTitles: SideTitles(showTitles: true),
                bottomTitles: SideTitles(showTitles: true),
              ),
              gridData: FlGridData(show: true, horizontalInterval: 1),
              borderData: FlBorderData(
                  show: true, border: Border.all(color: Colors.grey)),
              lineTouchData: LineTouchData(
                touchTooltipData: LineTouchTooltipData(
                  tooltipBgColor: Colors.blueAccent,
                  tooltipRoundedRadius: 8,
                  getTooltipItems: (List<LineBarSpot> touchedSpots) {
                    return touchedSpots.map((LineBarSpot touchedSpot) {
                      final flSpot = touchedSpot;
                      return LineTooltipItem(
                        '${flSpot.y.toStringAsFixed(2)}',
                        TextStyle(color: Colors.white),
                      );
                    }).toList();
                  },
                ),
                handleBuiltInTouches: true,
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pronóstico'),
        actions: [
          IconButton(
            icon: Icon(Icons.calendar_today),
            onPressed: () => _selectDate(context),
          ),
          IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: () => _selectTipoDato(context),
          ),
          IconButton(
            icon: Icon(Icons.show_chart),
            onPressed: () {
              // Obtén los datos para el gráfico (usando valores de ejemplo)
              List<double> chartData =
                  List.generate(pronostico.length, (index) {
                return double.parse(pronostico[index]["dato"]);
              });

              // Muestra el modal con el gráfico
              _showGraphModal(context, chartData);
            },
          ),
        ],
      ),
      drawer: Menu(),
      body: ListView.builder(
        itemCount: pronostico.length,
        itemBuilder: (context, index) {
          double valor = double.parse(pronostico[index]["dato"]);
          Widget measurementWidget =
              getMeasurementWidget(selectedTipoDato, valor);

          return Card(
            margin: EdgeInsets.all(8.0),
            child: ListTile(
              title: Row(
                children: [
                  Text(
                    'Fecha: ${pronostico[index]["fecha"]} Hora: ${pronostico[index]["hora"]}',
                  ),
                  SizedBox(width: 10),
                  measurementWidget,
                  // Widget de temperatura
                ],
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                      'Dato: ${pronostico[index]["dato"].toString().characters.take(7)}'),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
