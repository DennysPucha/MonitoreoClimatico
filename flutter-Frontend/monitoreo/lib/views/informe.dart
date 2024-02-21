import 'package:flutter/material.dart';
import 'package:monitoreo/controls/servicio_back/FacadeService.dart';
import 'package:monitoreo/views/componentes/Menu.dart';

class Informe extends StatefulWidget {
  const Informe({Key? key}) : super(key: key);

  @override
  State<Informe> createState() => _InformeState();
}

class _InformeState extends State<Informe> {
  late DateTime _selectedDate = DateTime.now();
  Map<String, dynamic> informe = {};
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarInformes();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate)
      setState(() {
        _selectedDate = picked;
        cargando = true; // Reinicia el estado de cargando
      });
  }

  Future<void> cargarInformes() async {
    FacadeService fs = FacadeService();
    var formattedDate = _selectedDate.toString().split(" ")[0];
    var response = await fs.getInformes(formattedDate);
    print(response.code);
    if (response.code == 200) {
      print("simn simn");
      SnackBar snackBar = SnackBar(
        content: Text('Datos cargados correctamente'),
        duration: Duration(seconds: 2),
      );
      print(response.datos);
      Map<String, dynamic> miniinforme = response.datos;
      if (miniinforme['promedioTemperatura'] == "No hay datos" &&
          miniinforme['promedioHumedad'] == "No hay datos" &&
          miniinforme['promedioPresionAtmosferica'] ==
              "No hay datos") {
        AlertDialog alert = AlertDialog(
          icon: Icon(Icons.warning_amber_rounded,
              color: Colors.blueAccent, size: 35),
          title:
              Text("Advertencia", style: TextStyle(color: Colors.blueAccent)),
          content: Text("No hay datos para la fecha seleccionada"),
        );
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return alert;
          },
        );
      } else {
        setState(() {
          informe = response.datos;
          cargando = false; // Establece el estado de cargando como falso
        });
      }
      print(informe);
    } else {
      SnackBar snackBar = SnackBar(
        content: Text('Error al cargar los datos'),
        duration: Duration(seconds: 2),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Monitoreo Climatico", style: TextStyle(fontSize: 12)),
        centerTitle: true,
      ),
      drawer: Menu(),
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Text(
                "Historial de Datos",
                style: TextStyle(fontSize: 50, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 50),
              Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Seleccione una Fecha:',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(width: 20),
                    ElevatedButton(
                      onPressed: () async {
                        await _selectDate(context);
                        await cargarInformes();
                      },
                      child: Text('Seleccionar'),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 30),
              if (cargando)
                CircularProgressIndicator()
              else if (informe.isEmpty)
                Text(
                  'Advertencia\nNo hay reportes registrados en este día',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 18, color: Colors.red),
                )
              else
                Card(
                  child: Container(
                    width: 300,
                    height: 200,
                    child: Padding(
                      padding: EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            'Informe del día ${_selectedDate.toString().split(" ")[0]}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 10),
                          Text(
                              'Temperatura: ${informe['promedioTemperatura']}'),
                          Text(
                              'Humedad: ${informe['promedioHumedad']}'),
                          Text(
                              'Presión Atmosférica: ${informe['promedioPresionAtmosferica']}'),
                          SizedBox(height: 20),
                          Center(
                            child: ElevatedButton(
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) {
                                    return DetalleInformeModal(
                                      selectedDate: _selectedDate,
                                    );
                                  },
                                );
                              },
                              child: Text('Ver Detalle'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class DetalleInformeModal extends StatefulWidget {
  final DateTime selectedDate;

  DetalleInformeModal({required this.selectedDate});

  @override
  _DetalleInformeModalState createState() =>
      _DetalleInformeModalState(selectedDate);
}

class _DetalleInformeModalState extends State<DetalleInformeModal> {
  String _selectedOption = 'NINGUNO';
  List<Map<String, dynamic>> reportes = [];
  Map<String, dynamic> clima = {};
  DateTime selectedDate;
  bool _showClimaMessage = false;
  _DetalleInformeModalState(this.selectedDate);

  @override
  void initState() {
    super.initState();
    cargarReportes();
  }

  Future<void> cargarReportes() async {
    FacadeService fs = FacadeService();
    var response = await fs.getReportes(widget.selectedDate, _selectedOption);
    if (response.code == 200) {
      setState(() {
        reportes = List<Map<String, dynamic>>.from(response.datos);
      });
      print(reportes);
    }
  }

  Future<void> detClima() async {
    FacadeService fs = FacadeService();
    var response = await fs.detClima(widget.selectedDate);
    if (response.code == 200) {
      setState(() {
        clima = Map<String, dynamic>.from(response.datos);
      });
    }
  }
  
@override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Row(
        children: [
          Text("Reportes del Sensor"),
          SizedBox(width: 30),
          Tooltip(
            message: 'Ver Clima',
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () async {
                  await detClima();
                  _viewShowDialog(context, clima, widget.selectedDate);
                },
                child: Icon(
                  Icons.info_outline_rounded,
                  color: Colors.blueAccent,
                ),
              ),
            ),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Filtrar por tipo de dato: '),
              SizedBox(width: 20),
              DropdownButton<String>(
                value: _selectedOption,
                items: <String>[
                  'NINGUNO',
                  'Temperatura',
                  'Humedad',
                  'PresionAtmosferica'
                ].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedOption = newValue!;
                    cargarReportes();
                  });
                },
              ),
            ],
          ),
          SizedBox(height: 20),
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.5,
            child: SingleChildScrollView(
              child: DataTable(
                columns: [
                  DataColumn(label: Text('Hora registro')),
                  DataColumn(label: Text('Dato')),
                  DataColumn(label: Text('Tipo de dato')),
                ],
                rows: reportes.map((Map<String, dynamic> data) {
                  return DataRow(cells: [
                    DataCell(Text(data['hora_registro'])),
                    DataCell(Text(data['dato'])),
                    DataCell(Text(data['tipo_dato'])),
                  ]);
                }).toList(),
              ),
            ),
          ),
        ],
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: Text('Cerrar'),
        ),
      ],
    );
  }

  void _viewShowDialog(BuildContext context, Map<String, dynamic> clima,  fecha) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Row(
          children: [
            Text("Clima del día:  ${fecha.toString().substring(0, 10)}"),
            SizedBox(width: 30),
            _buildWeatherIcon(clima['clima'])
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            
            Text('Clima: ${clima['clima']}'),
            Text('Descripción: ${clima['descripcion']}'),
          ],
        ),
        actions: <Widget>[
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: Text('Cerrar'),
          ),
        ],
      );
    },
  );
}

Widget _buildWeatherIcon(String clima) {
  switch (clima) {
    case 'Caluroso y húmedo':
      return Icon(Icons.wb_sunny, color: Colors.yellow, size: 50);
    case 'Frío y baja presión':
      return Icon(Icons.cloud, color: Colors.grey, size: 50);
    case 'Caluroso':
      return Icon(Icons.wb_sunny, color: Colors.yellow, size: 50);
    case 'Frío y alta presión':
      return Icon(Icons.ac_unit, color: Colors.blue, size: 50);
    case 'Húmedo':
      return Icon(Icons.grain, color: Colors.grey, size: 50);
    case 'Normal con baja presión':
      return Icon(Icons.wb_sunny, color: Colors.blue, size: 50);
    case 'Normal':
      return Icon(Icons.wb_cloudy, color: Colors.blue, size: 50);
    default:
      return Icon(Icons.wb_cloudy, color: Colors.grey, size: 50);
  }
}
}


void main() {
  runApp(MaterialApp(
    title: 'Informe App',
    home: Informe(),
  ));
}
