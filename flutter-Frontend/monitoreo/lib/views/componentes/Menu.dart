import 'package:flutter/material.dart';

class Menu extends StatelessWidget {
  static GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            child: Text(
              'Monitoreo de clima',
              style: TextStyle(
                color: Colors.blueAccent,
                fontSize: 30,
                fontWeight: FontWeight.bold, // Estilo de letra más gordo
              ),
            ),
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                    'https://i.pinimg.com/564x/c9/5b/98/c95b98aa8abedfda244b1dcc8e5e9a7d.jpg'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('Principal'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/principal');
            },
          ),
          ListTile(
            leading: Icon(Icons.newspaper),
            title: Text('Pronostico'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/pronostico');
            },
          ),
          ListTile(
            leading: Icon(Icons.bar_chart),
            title: Text('Gráfica de datos climáticos'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/grafica');
            },
          ),
          ListTile(
            leading: Icon(Icons.history),
            title: Text('Historial'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/informe');
            },
          ),

          // Agrega más elementos aquí
        ],
      ),
    );
  }
}
