import 'dart:developer';
import 'dart:ui';
import 'dart:convert';
import 'dart:core';
import 'package:http/http.dart' as http;
import 'package:pis_monitoreo/serviciosBack/RespuestaGenerica.dart';

class Conexion {
  final String URL = "http://localhost:3000/monitoreo";

  RespuestaGenerica _response(int code, String msg, dynamic data) {
    var respuesta = RespuestaGenerica();
    respuesta.code = code;
    respuesta.msg = msg;
    respuesta.datos = data;
    return respuesta;
  }
}
