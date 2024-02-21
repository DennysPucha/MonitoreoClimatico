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
    return await c.get(
        'buscarporFechaYTipoDato/reportes?fecha=$fecha&tipo_dato=$tipoDatoFiltro',
        false);
  }

  Future<RespuestaGenerica> detClima(fecha) async {
    return await c.get('buscarporFecha/determinarClima?fecha=$fecha', false);
  }

  Future<RespuestaGenerica> resumenesPorfechas(fechaInicio, fechaFin) async {
    return await c.get(
        'resumenRangoFechas/reportes/?fechaInicio=$fechaInicio&fechaFin=$fechaFin',
        false);
  }

  Future<RespuestaGenerica> banearUsuarioxComentario(
      String external, Map<String, String> mapa) async {
    return await c.post('comentario/banear/$external', true, mapa);
  }

  Future<RespuestaGenerica> obtenerUltimoMonitoreo() async {
    Map<String, String> _header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    final String _url = '${c.URL}/ultimoReporte/reportes/';
    final uri = Uri.parse(_url);
    RespuestaGenerica res = RespuestaGenerica();
    try {
      final response = await http.get(uri, headers: _header);
      res.code = response.statusCode;
      res.msg = response.body;
      res.datos = {};
      if (response.statusCode == 200) {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString());
        res.code = mapa['code'];
        res.msg = mapa['message'];
        res.datos = mapa['data'];
      } else {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString() + "error");
        res.code = mapa['code'];
        res.msg = mapa['mensaje'];
        res.datos = mapa['data'];
        log("no se pudo encontrar");
      }
      return res;
    } catch (e) {
      log(e.toString());
    }
    return res;
  }

  Future<RespuestaGenerica> traerRangos() async {
    Map<String, String> _header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    final String _url = '${c.URL}/obtener/rangos/';
    final uri = Uri.parse(_url);
    RespuestaGenerica res = RespuestaGenerica();
    try {
      final response = await http.get(uri, headers: _header);
      res.code = response.statusCode;
      res.msg = response.body;
      res.datos = {};
      if (response.statusCode == 200) {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString());
        res.code = mapa['code'];
        res.msg = mapa['message'];
        res.datos = mapa['data'];
      } else {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString() + "error");
        res.code = mapa['code'];
        res.msg = mapa['message'];
        res.datos = mapa['data'];
        log("no se pudo encontrar");
      }
      return res;
    } catch (e) {
      log(e.toString());
    }
    return res;
  }

  Future<RespuestaGenerica> buscarFecha(
      String tipo_pronostico, String fecha) async {
    Map<String, String> _header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    final String _url =
        '${c.URL}/buscarporFecha/pronosticos/?fecha=$fecha&tipo_pronostico=$tipo_pronostico';

    final uri = Uri.parse(_url);
    RespuestaGenerica res = RespuestaGenerica();

    try {
      final response = await http.get(uri, headers: _header);
      res.code = response.statusCode;
      res.msg = response.body;
      res.datos = {};

      if (response.statusCode == 200) {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString());
        res.code = mapa['code'];
        res.msg = mapa['message'];
        res.datos = mapa['data'];
        log("si se pudo encontrar");
      } else {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString() + " error");
        res.code = mapa['code'];
        res.msg = mapa['message'];
        res.datos = mapa['data'];
        log("no se pudo encontrar");
      }

      return res;
    } catch (e) {
      log(e.toString());

      return res;
    }
  }
}
