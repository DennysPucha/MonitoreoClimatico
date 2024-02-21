import 'package:flutter/material.dart';
import 'package:monitoreo/controls/servicio_back/FacadeService.dart';
import 'package:monitoreo/controls/servicio_back/RespuestaGenerica.dart';
import 'package:monitoreo/views/componentes/Menu.dart';


class PrincipalPage extends StatefulWidget {
  @override
  _PrincipalPageState createState() => _PrincipalPageState();
}

class _PrincipalPageState extends State<PrincipalPage> {
  Map<String, dynamic>? reporteTemperatura;
  Map<String, dynamic>? reporteHumedad;
  Map<String, dynamic>? reportePresionAtmosferica;

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    verUltimoMonitoreo();
  }

  Future<void> verUltimoMonitoreo() async {
    try {
      FacadeService servicio = FacadeService();
      RespuestaGenerica value = await servicio.obtenerUltimoMonitoreo();

      print(value.datos);
      if (value.code == 200) {
        setState(() {
          Map<String, dynamic> data = value.datos;
          reporteTemperatura = data['reporteTemperatura'];
          reporteHumedad = data['reporteHumedad'];
          reportePresionAtmosferica = data['reportePresionAtmosferica'];
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error ${value.code}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error $e')),
      );
    }
  }

  Widget buildWeatherCard() {
    String weatherImageUrl =
        'https://i.pinimg.com/564x/04/83/cc/0483cc1416c82c6d9b36ec83dbbf647b.jpg'; // URL predeterminada para una imagen soleada

    String weatherDescription = ''; // Variable para la descripción del clima

    if (reporteTemperatura != null &&
        reporteHumedad != null &&
        reportePresionAtmosferica != null) {
      double temperatura = double.parse(reporteTemperatura!['dato'].toString());
      double humedad = double.parse(reporteHumedad!['dato'].toString());
      double presion =
          double.parse(reportePresionAtmosferica!['dato'].toString());

      // Lógica para determinar el estado del clima
      if (temperatura > 25 && humedad < 60 && presion > 1010) {
        weatherImageUrl =
            'https://i.pinimg.com/564x/ef/92/36/ef923610542197dde30c71d070bba8a5.jpg'; // Imagen para clima caliente y seco
        weatherDescription = 'Soleado y Caluroso';
      } else if (temperatura < 10) {
        weatherImageUrl =
            'https://i.pinimg.com/564x/04/83/cc/0483cc1416c82c6d9b36ec83dbbf647b.jpg'; // Imagen para clima frío
        weatherDescription = 'Frío';
      } else if (presion < 1005) {
        weatherImageUrl =
            'https://i.pinimg.com/564x/4f/e5/cf/4fe5cf47467e2e1e10347e8527fcbfea.jpg'; // Imagen para clima nublado
        weatherDescription = 'Nublado';
      } else {
        weatherImageUrl =
            'https://i.pinimg.com/564x/04/83/cc/0483cc1416c82c6d9b36ec83dbbf647b.jpg'; // Imagen por defecto
        weatherDescription = 'Clima Indefinido';
      }
    }

    return Card(
      elevation: 5,
      margin: EdgeInsets.all(16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          Container(
            height: 150, // Altura de la imagen del clima
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(15),
                topRight: Radius.circular(15),
              ),
              image: DecorationImage(
                image: NetworkImage(weatherImageUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  weatherDescription, // Usar la variable weatherDescription en lugar de 'Clima Actual'
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 20),
                if (reporteTemperatura != null)
                  Center(
                    child: buildCardContent(
                        Icons.thermostat, 'Temperatura', reporteTemperatura!),
                  ),
                if (reporteHumedad != null)
                  Center(
                    child: buildCardContent(
                        Icons.water_damage_rounded, 'Humedad', reporteHumedad!),
                  ),
                if (reportePresionAtmosferica != null)
                  Center(
                    child: buildCardContent(Icons.cloud, 'Presión Atmosférica',
                        reportePresionAtmosferica!),
                  ),
                SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget buildCardContent(
      IconData icon, String title, Map<String, dynamic> data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, size: 40, color: Colors.blueAccent),
            SizedBox(width: 20),
            Text(
              title,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ],
        ),
        SizedBox(height: 12),
        Text(
          'Dato: ${data['dato'].toString()}',
          style: TextStyle(
            fontSize: 18,
            color: Colors.black54,
          ),
        ),
        SizedBox(height: 20),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text('Página Principal'),
        // Añade el icono de menú
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: () {
            // Abre el Drawer al tocar el icono de menú
            _scaffoldKey.currentState!.openDrawer();
          },
        ),
      ),
      // Incorpora el Drawer de tu componente Menu
      drawer: Menu(),
      body: SingleChildScrollView(
        child: buildWeatherCard(),
      ),
    );
  }
}
