import 'dart:convert';
import 'dart:developer';
import 'package:monitoreo_climatico/controls/Conexion.dart';
import 'package:monitoreo_climatico/controls/servicio_back/RespuestaGenerica.dart';
//import 'package:noticias/controls/servicio_back/RespuestaGenerica.dart';

import 'package:http/http.dart' as http;

// no se llama a conexion, se encapsula datos sensibles 
class FacadeService {
  Conexion c = Conexion();
  

  Future<RespuestaGenerica> registro(Map<String, String> mapa) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}/guardarUsuario';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    print(mapa);
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          isws.code = 404;
          isws.msg = 'Recurso No Encontrado';
          isws.datos = {};
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

  Future<RespuestaGenerica> comentario(Map<String, String> mapa) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}comentario/crear';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          isws.code = 404;
          isws.msg = 'Recurso No Encontrado';
          isws.datos = {};
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

  Future<RespuestaGenerica> listarComentarios(String external) async {
    return await c.solicitudGet('noticia/obtenerComentarios/$external', false);
  }

  Future<RespuestaGenerica> listarNoticias() async {
    return await c.solicitudGet('/ver/noticias', false);
  }

  Future<RespuestaGenerica> guardarComentarios(Map<String, String> mapa) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}/guardarComentario';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    print(mapa);
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
          Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        if (response.statusCode == 400) {
          isws.code = mapa['code'];
          isws.msg = mapa['msg'];
          isws.datos = [];
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

  Future<RespuestaGenerica> modificarUsuario(Map<String, String> mapa, String external) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}/modificarUsuario/$external';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    print(mapa);
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          isws.code = 404;
          isws.msg = 'Recurso No Encontrado';
          isws.datos = {};
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

  Future<RespuestaGenerica> obtenerUsuario(String external) async {
    return await c.solicitudGet('/obtenerPersona/$external', false);
  }

  Future<RespuestaGenerica> modificarComentario(Map<String, String> mapa, String external) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}comentario/modificar/$external';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    print(mapa);
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        if (response.statusCode == 400) {
          isws.code = mapa['code'];
          isws.msg = mapa['msg'];
          isws.datos = [];
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

  Future<RespuestaGenerica> obtenerComentario(String external) async {
    return await c.solicitudGet('comentario/obtener/$external', false);
  }

  Future<RespuestaGenerica> verTodosLosComentarios() async {
    return await c.solicitudGet('ver/comentarios', false);
  }


  Future<RespuestaGenerica> modificarAdministrador(Map<String, String> mapa, String external) async {
    Map<String, String> header = {'Content-Type': 'application/json'};

    final String url = '${c.URL}/modificarAdministrador/$external';

    final uri = Uri.parse(url);
    RespuestaGenerica isws = RespuestaGenerica();
    print(mapa);
    try {
      final response =
          await http.post(uri, headers: header, body: jsonEncode(mapa));
      if (response.statusCode != 200) {
        if (response.statusCode == 400) {
          isws.code = 404;
          isws.msg = 'Recurso No Encontrado';
          isws.datos = {};
          return isws;
        }
      } else {
        Map<dynamic, dynamic> mapa = jsonDecode(response.body);
        isws.code = mapa['code'];
        isws.msg = mapa['msg'];
        isws.datos = mapa['data'];
        return isws;
      }
    } catch (e) {
      isws.code = 500;
      isws.msg = 'Error Inesperado';
      isws.datos = {};
      return isws;
    }
    return isws;
  }

}
