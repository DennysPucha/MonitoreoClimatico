import 'dart:convert';

import 'package:monitoreo/controls/Conexion.dart';
import 'package:monitoreo/controls/servicio_back/RespuestaGenerica.dart';

import 'package:monitoreo/controls/servicio_back/modelo/InicioSesion.dart';
import "package:http/http.dart" as http;
import 'dart:developer';

class FacadeService {
  Conexion c = Conexion();
  Future<InicioSesionSw> login(Map<String, String> mapa) async {
    Map<String, String> header = {
      "Content-type": "application/json",
      "Accept": "application/json",
    };

    final String _url = c.URL + "inicio_sesion";
    final uri = Uri.parse(_url);

    InicioSesionSw isw = InicioSesionSw();
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      //log(response.body);
      if (response.statusCode != 200) {
        if (response.statusCode == 404) {
          isw.code = 404;
          isw.msg = "Page not found";
          isw.tag = "error";
          isw.datos = [];
        } else {
          Map<dynamic, dynamic> mapa = jsonDecode(response.body);
          isw.code = mapa['code'];
          isw.msg = mapa['msg'];
          isw.tag = mapa['tag'];
          isw.datos = mapa['datos'];
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isw.code = mapa['code'];
        isw.msg = mapa['msg'];
        isw.tag = "OK! Inicio sesion correcto";
        isw.datos = mapa['datos'];
      }
    } catch (e) {
      isw.code = 500;
      isw.msg = "Internal error";
      isw.tag = "error";
      isw.datos = [];
    }
    return isw;
  }

  Future<RespuestaGenerica> getInformes(fecha) async {
    return await c.get('resumenFecha/reportes?fecha=$fecha', false);
  }

  Future<RespuestaGenerica> getReportes(fecha, tipoDatoFiltro) async {
    return await c.get('buscarporFechaYTipoDato/reportes?fecha=$fecha&tipo_dato=$tipoDatoFiltro', false);
  }

  Future<RespuestaGenerica> detClima(fecha) async {
    return await c.get('buscarporFecha/determinarClima?fecha=$fecha', false);
  }

  Future<RespuestaGenerica> resumenesPorfechas(fechaInicio, fechaFin) async {
    return await c.get('resumenRangoFechas/reportes/?fechaInicio=$fechaInicio&fechaFin=$fechaFin', false);
  }

  Future<RespuestaGenerica> banearUsuarioxComentario(String external, Map<String, String> mapa) async {
    return await c.post('comentario/banear/$external', true, mapa);
  }

  
}
