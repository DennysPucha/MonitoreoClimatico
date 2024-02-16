"use strict";

const models = require("../models");
const { reporte, rol, cuenta, sequelize, persona, sensor } = models;
const uuid = require("uuid");
class ReporteControl {
  async obtener(req, res) {
    const external = req.params.external;

    try {
      const lista = await reporte.findOne({
        where: { external_id: external },
        attributes: [
          "fecha",
          "hora_registro",
          "dato",
          "tipo_dato",
          "external_id",
        ],
      });

      if (!lista) {
        res.status(404);
        return res.json({
          message: "Recurso no encontrado",
          code: 404,
          data: {},
        });
      }

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: lista });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }

  async listar(req, res) {
    try {
      const lista = await reporte.findAll({
        attributes: [
          "fecha",
          "hora_registro",
          "dato",
          "tipo_dato",
          "external_id",
        ],
      });

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: lista });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }
  async listarUltimos(req, res) {
    try {
      const lista = await reporte.findAll({
        attributes: [
          "fecha",
          "hora_registro",
          "dato",
          "tipo_dato",
          "external_id",
        ],
        order: [["id", "DESC"]],
        limit: 20,
      });

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: lista });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }

  async guardar(req, res) {
    const { fecha, dato, tipo_dato, sensor: id_sesnsor } = req.body;

    if (fecha && dato && id_sensor) {
      try {
        const sensorA = await models.sensor.findOne({
          where: { external_id: id_sensor },
        });

        if (!sensorA) {
          res.status(400);
          return res.json({
            message: "Error de solicitud",
            tag: "Sensor no existente",
            code: 400,
          });
        }

        if (!sensorA.estado) {
          res.status(403);
          return res.json({
            message: "Operación prohibida. El sensor está desactivado.",
            code: 403,
          });
        }

        const data = {
          fecha,
          dato,
          tipo_dato,
          external_id: uuid.v4(),
          id_sensor: sensorA.id,
        };

        const transaction = await sequelize.transaction();

        try {
          const result = await reporte.create(data);

          await transaction.commit();

          if (!result) {
            res.status(401);
            return res.json({
              message: "Error de autenticación",
              tag: "No se puede crear",
              code: 401,
            });
          }

          res.status(200);
          res.json({ message: "Éxito", code: 200 });
        } catch (error) {
          await transaction.rollback();
          res.status(203);
          res.json({
            message: "Error de procesamiento",
            code: 203,
            error: error.message,
          });
        }
      } catch (error) {
        res.status(500);
        res.json({
          message: "Error interno del servidor",
          code: 500,
          error: error.message,
        });
      }
    } else {
      res.status(400);
      res.json({
        message: "Error de solicitud",
        tag: "Datos incorrectos",
        code: 400,
      });
    }
  }

  async modificar(req, res) {
    if (
      req.body.hasOwnProperty("fecha") &&
      req.body.hasOwnProperty("dato") &&
      req.body.hasOwnProperty("tipo_dato") &&
      req.body.hasOwnProperty("sensor")
    ) {
      const external = req.params.external;

      try {
        const reporteA = await models.reporte.findOne({
          where: { external_id: external },
        });

        const sensorA = await models.sensor.findOne({
          where: { external_id: req.body.sensor },
        });

        if (!sensorA) {
          res.status(400);
          return res.json({
            msg: "ERROR",
            tag: "Sensor no existente",
            code: 400,
          });
        }

        if (!reporteA) {
          res.status(400);
          return res.json({
            msg: "ERROR",
            tag: "Reporte no existente",
            code: 400,
          });
        }

        if (!sensorA.estado) {
          res.status(403);
          return res.json({
            message: "Operación prohibida. El sensor está desactivado.",
            code: 403,
          });
        }
        const data = {
          fecha: req.body.fecha,
          dato: req.body.dato,
          id_sensor: sensorA.id,
        };

        const transaction = await models.sequelize.transaction();

        try {
          await reporteA.update(data);

          await transaction.commit();

          res.status(200);
          res.json({ msg: "OK", code: 200 });
        } catch (error) {
          if (transaction) await transaction.rollback();

          res.status(203);
          res.json({ msg: "ERROR", code: 203, error_msg: error.message });
        }
      } catch (error) {
        res.status(500);
        res.json({ msg: "ERROR", code: 500, error_msg: error.message });
      }
    } else {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
    }
  }
  async buscar(req, res) {
    const external = req.params.external;
    const horaInicio = req.query.horaInicio;
    const horaFin = req.query.horaFin;
    const { Op } = require("sequelize");
    try {
      const reportesPorHora = await reporte.findAll({
        where: {
          external_id: external,
          hora_registro: { [Op.between]: [horaInicio, horaFin] },
        },
        attributes: [
          "fecha",
          "hora_registro",
          "dato",
          "tipo_dato",
          "external_id",
        ],
      });

      if (!reportesPorHora || reportesPorHora.length === 0) {
        res.status(404);
        return res.json({
          message: "Recurso no encontrado para la hora especificada",
          code: 404,
          data: {},
        });
      }

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: reportesPorHora });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }

  async buscarporFecha(req, res) {
    const fechaEspecifica = req.query.fecha;

    try {
      const reportesPorFecha = await reporte.findAll({
        where: {
          fecha: fechaEspecifica,
        },
        attributes: [
          "fecha",
          "dato",
          "hora_registro",
          "tipo_dato",
          "external_id",
        ],
      });

      if (!reportesPorFecha || reportesPorFecha.length === 0) {
        res.status(404);
        return res.json({
          message: "No hay informe para la fecha especificada",
          code: 404,
          data: {},
        });
      }

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: reportesPorFecha });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }
  async buscarporFechaYTipoDato(req, res) {
    const fechaEspecifica = req.query.fecha;
    const tipoDatoEspecifico = req.query.tipo_dato;

    try {
      const reportesFiltrados = await reporte.findAll({
        where: {
          fecha: fechaEspecifica,
          tipo_dato: tipoDatoEspecifico,
        },
        attributes: [
          "fecha",
          "dato",
          "hora_registro",
          "tipo_dato",
          "external_id",
        ],
      });

      if (!reportesFiltrados || reportesFiltrados.length === 0) {
        res.status(404);
        return res.json({
          message: "No hay informe para la fecha y tipo de dato especificados",
          code: 404,
          data: {},
        });
      }

      res.status(200);
      res.json({ message: "Éxito", code: 200, data: reportesFiltrados });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }
  async resumenPorFecha(req, res) {
    const fechaEspecifica = req.query.fecha;

    try {
      const reportesTemperatura = await reporte.findAll({
        where: {
          fecha: fechaEspecifica,
          tipo_dato: "TEMPERATURA",
        },
        attributes: ["dato"],
      });

      const reportesHumedad = await reporte.findAll({
        where: {
          fecha: fechaEspecifica,
          tipo_dato: "HUMEDAD",
        },
        attributes: ["dato"],
      });

      const reportesPresionAtmosferica = await reporte.findAll({
        where: {
          fecha: fechaEspecifica,
          tipo_dato: "PRESION_ATMOSFERICA",
        },
        attributes: ["dato"],
      });

      const obtenerDatoMasRecurrente = (reportes) => {
        if (!reportes || reportes.length === 0) {
          return "No hay datos";
        }

        const datosRecurrentes = reportes.reduce((contador, reporte) => {
          contador[reporte.dato] = (contador[reporte.dato] || 0) + 1;
          return contador;
        }, {});

        const datoMasRecurrente = Object.keys(datosRecurrentes).reduce(
          (dato, key) =>
            datosRecurrentes[key] > datosRecurrentes[dato] ? key : dato,
          Object.keys(datosRecurrentes)[0]
        );

        return datoMasRecurrente !== null ? datoMasRecurrente : "No hay datos";
      };

      const datoMasRecurrenteTemperatura =
        obtenerDatoMasRecurrente(reportesTemperatura);
      const datoMasRecurrenteHumedad =
        obtenerDatoMasRecurrente(reportesHumedad);
      const datoMasRecurrentePresionAtmosferica = obtenerDatoMasRecurrente(
        reportesPresionAtmosferica
      );

      res.status(200);
      res.json({
        message: "Éxito",
        code: 200,
        data: {
          fecha: fechaEspecifica,
          datoMasRecurrenteTemperatura,
          datoMasRecurrenteHumedad,
          datoMasRecurrentePresionAtmosferica,
        },
      });
    } catch (error) {
      res.status(500);
      res.json({
        message: "Error interno del servidor",
        code: 500,
        error: error.message,
      });
    }
  }
  /*
  async borrarTodosLosDatos() {
    try {
      const cantidadBorrada = await reporte.destroy({
        where: {}, // Sin condiciones, borra todos los registros
        truncate: true, // Reinicia la secuencia del ID
      });
  
      console.log(`${cantidadBorrada} registros de 'reporte' fueron borrados.`);
    } catch (error) {
      console.error("Error al borrar los datos:", error.message);
    }
  }
  */
}
module.exports = ReporteControl;
