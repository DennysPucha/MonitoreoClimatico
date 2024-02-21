"use strict";

const models = require("../models");
const { Op } = require('sequelize');
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

    async guardar(req, res) {
        const { fecha, dato, tipo_dato, sensor: id_sensor } = req.body;

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


    async determinarClima(req, res) {
        const fechaEspecifica = req.query.fecha;
        function calcularPromedio(arr) {
            if (arr.length === 0) return 0;
            const suma = arr.reduce((total, valor) => total + valor, 0);
            return suma / arr.length;
        }
        try {
            const datos = await reporte.findAll({
                where: { fecha: fechaEspecifica },
                attributes: ["dato", "tipo_dato"],
            });

            let temperaturas = [];
            let humedades = [];
            let presiones = [];

            datos.forEach(dato => {
                if (dato.tipo_dato === "TEMPERATURA") {
                    temperaturas.push(dato.dato);
                } else if (dato.tipo_dato === "HUMEDAD") {
                    humedades.push(dato.dato);
                } else if (dato.tipo_dato === "PRESION_ATMOSFERICA") {
                    presiones.push(dato.dato);
                }
            });

            const temperaturaPromedio = calcularPromedio(temperaturas);
            const humedadPromedio = calcularPromedio(humedades);
            const presionPromedio = calcularPromedio(presiones);

            let clima = "Desconocido";
            let descripcion = "";

            // Continuación de la lógica para determinar el clima basado en los promedios
            if (temperaturaPromedio > 25 && humedadPromedio > 70) {
                clima = "Caluroso y húmedo";
                descripcion = "El clima es caluroso y húmedo, prepárate para altas temperaturas y humedad.";
            } else if (temperaturaPromedio < 10 && presionPromedio < 1000) {
                clima = "Frío y baja presión";
                descripcion = "El clima es frío con baja presión atmosférica, se espera un día fresco y posiblemente lluvioso.";
            } else if (temperaturaPromedio > 25 && humedadPromedio <= 70) {
                clima = "Caluroso";
                descripcion = "El clima es caluroso, prepárate para altas temperaturas.";
            } else if (temperaturaPromedio < 10 && presionPromedio >= 1000) {
                clima = "Frío y alta presión";
                descripcion = "El clima es frío con alta presión atmosférica, se espera un día fresco y claro.";
            } else if (temperaturaPromedio > 10 && temperaturaPromedio <= 25 && humedadPromedio > 70) {
                clima = "Húmedo";
                descripcion = "El clima es húmedo, se espera una sensación de humedad en el ambiente.";
            } else if (temperaturaPromedio > 10 && temperaturaPromedio <= 25 && presionPromedio < 1000) {
                clima = "Normal con baja presión";
                descripcion = "El clima es normal con baja presión atmosférica, se recomienda estar atento a posibles cambios en el clima.";
            } else {
                clima = "Normal";
                descripcion = "El clima es normal para esta fecha, sin condiciones climáticas extremas.";
            }

            // Se verifica si hay probabilidad de lluvia
            if (humedadPromedio > 80 && presionPromedio < 1000) {
                descripcion += " Además, se esperan lluvias.";
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: { clima, descripcion } });
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
            let whereClause = {
                fecha: fechaEspecifica,
            };

            if (tipoDatoEspecifico !== "NINGUNO") {
                whereClause.tipo_dato = tipoDatoEspecifico;
            }

            const reportesFiltrados = await reporte.findAll({
                where: whereClause,
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

            const calcularPromedio = (reportes) => {
                if (!reportes || reportes.length === 0) {
                    return "No hay datos";
                }

                const numeros = reportes.map(reporte => parseFloat(reporte.dato));
                const total = numeros.reduce((acumulador, numero) => acumulador + numero, 0);
                const promedio = total / numeros.length;
                return parseFloat(promedio.toFixed(3));
            };

            const promedioTemperatura = calcularPromedio(reportesTemperatura);
            const promedioHumedad = calcularPromedio(reportesHumedad);
            const promedioPresionAtmosferica = calcularPromedio(reportesPresionAtmosferica);

            const data = {
                fecha: fechaEspecifica,
                promedioTemperatura,
                promedioHumedad,
                promedioPresionAtmosferica,
            };
            console.log(data);

            res.status(200);
            res.json({
                message: "Éxito",
                code: 200,
                data: data,
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

    async resumenPorRangoDeFechas(req, res) {
        const fechaInicio = req.query.fechaInicio;
        const fechaFin = req.query.fechaFin;

        try {
            const reportes = await reporte.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fechaInicio, fechaFin]
                    },
                },
                attributes: ["fecha", "tipo_dato", "dato"],
                order: [["fecha", "ASC"]],
            });

            const promediosPorDia = {};
            reportes.forEach(reporte => {
                const fecha = reporte.fecha;
                if (!promediosPorDia[fecha]) {
                    promediosPorDia[fecha] = {};
                }
                if (!promediosPorDia[fecha][reporte.tipo_dato]) {
                    promediosPorDia[fecha][reporte.tipo_dato] = [];
                }
                promediosPorDia[fecha][reporte.tipo_dato].push(parseFloat(reporte.dato));
            });

            for (const fecha in promediosPorDia) {
                for (const tipo_dato in promediosPorDia[fecha]) {
                    const promedio = promediosPorDia[fecha][tipo_dato].reduce((acc, curr) => acc + curr, 0) / promediosPorDia[fecha][tipo_dato].length;
                    promediosPorDia[fecha][tipo_dato] = parseFloat(promedio.toFixed(3));
                }
            }

            res.status(200);
            res.json({
                message: "Éxito",
                code: 200,
                data: promediosPorDia,
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

    async ultimoReporte(req, res) {
        try {
            const reporteTemperatura = await reporte.findOne({
                where: {
                    tipo_dato: 'TEMPERATURA',
                },
                order: [['fecha', 'DESC']],
                attributes: ['fecha', 'dato', 'hora_registro', 'tipo_dato', 'external_id'],
                include: [{
                    model: sensor,
                    attributes: ['nombre']
                }]
            });

            const reporteHumedad = await reporte.findOne({
                where: {
                    tipo_dato: 'HUMEDAD',
                },
                order: [['fecha', 'DESC']],
                attributes: ['fecha', 'dato', 'hora_registro', 'tipo_dato', 'external_id'],
                include: [{
                    model: sensor,
                    attributes: ['nombre']
                }]
            });

            const reportePresionAtmosferica = await reporte.findOne({
                where: {
                    tipo_dato: 'PRESION_ATMOSFERICA',
                },
                order: [['fecha', 'DESC']],
                attributes: ['fecha', 'dato', 'hora_registro', 'tipo_dato', 'external_id'],
                include: [{
                    model: sensor,
                    attributes: ['nombre']
                }]
            });

            res.status(200);
            res.json({
                message: "Éxito",
                code: 200,
                data: {
                    reporteTemperatura,
                    reporteHumedad,
                    reportePresionAtmosferica,
                },
            });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
}
module.exports = ReporteControl;