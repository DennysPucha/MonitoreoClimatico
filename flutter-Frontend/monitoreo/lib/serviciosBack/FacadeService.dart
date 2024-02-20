import 'dart:convert';
import 'dart:developer';
import 'package:http/http.dart' as http;
import 'package:pis_monitoreo/serviciosBack/RespuestaGenerica.dart';
import 'package:pis_monitoreo/utiles/Conexion.dart';

// no se llama a conexion, se encapsula datos sensibles
class FacadeService {
  Conexion c = Conexion();

  Future<RespuestaGenerica> desactivarComentarios(
      String externalPersona) async {
    Map<String, String> _header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    final String _url = '${c.URL}comentarios/desactivar/$externalPersona';
    final uri = Uri.parse(_url);
    RespuestaGenerica res = RespuestaGenerica();
    try {
      final response = await http.put(uri, headers: _header);
      res.code = response.statusCode;
      res.msg = response.body;
      res.datos = {};
      if (response.statusCode == 200) {
        Map<String, dynamic> mapa = json.decode(response.body);
        // log(mapa.toString());
        res.code = mapa['code'];
        res.msg = mapa['msg'];
        res.datos = mapa['datos'];
        log("si se pudo encontrar");
      } else {
        Map<String, dynamic> mapa = json.decode(response.body);
        log(mapa.toString() + "error");
        res.code = mapa['code'];
        res.msg = mapa['msg'];
        res.datos = mapa['datos'];
        log("no se pudo encontrar");
      }
      return res;
    } catch (e) {
      log(e.toString());
    }
    return res;
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
