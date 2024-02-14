"use strict";
const cron = require("node-cron");
const axios = require("axios");
const models = require("../models");
const { sensor, rol, cuenta, sequelize, persona, reporte } = models;
const uuid = require("uuid");
const ip = require("ip");

class SensorControl {
    async obtener(req, res) {
        const external = req.params.external;

        try {
            const lista = await sensor.findOne({
                where: { external_id: external },
                attributes: ["nombre", "ip", "estado", "external_id"],
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

    async obtenerReportes(req, res) {
        const external = req.params.external;

        try {
            const lista = await sensor.findOne({
                where: { external_id: external },
                include: [
                    {
                        model: models.reporte,
                        as: "reporte",
                        attributes: [
                            "fecha",
                            "dato",
                            "tipo_dato",
                            "hora_registro",
                            "external_id",
                        ],
                        limit: 100,
                        order: [["fecha", "DESC"]],
                    },

                ],
                attributes: ["nombre", "ip", "estado", "external_id"],
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
            const lista = await sensor.findAll({
                attributes: ["nombre", "ip", "estado", "external_id"],
                include: [
                    {
                        model: models.reporte,
                        as: "reporte",
                        attributes: [
                            "fecha",
                            "dato",
                            "tipo_dato",
                            "hora_registro",
                            "external_id",
                        ],
                    },
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
        const { nombre, ip: direccionIP, puerto, persona: id_persona } = req.body;

        if (nombre && direccionIP && id_persona && puerto) {
            try {
                const perA = await models.persona.findOne({
                    where: { external_id: id_persona },
                });

                if (!perA) {
                    res.status(400);
                    return res.json({
                        message: "Error de solicitud",
                        tag: "Persona no existente",
                        code: 400,
                    });
                }

                if (!ip.isV4Format(direccionIP) && !ip.isV6Format(direccionIP)) {
                    res.status(400);
                    return res.json({
                        message: "Error de solicitud",
                        tag: "Dirección IP no valida",
                        code: 400,
                    });
                }

                if (isNaN(puerto) || puerto <= 0) {
                    res.status(400);
                    return res.json({
                        message: "Error de solicitud",
                        tag: "Puerto no válido o no positivo",
                        code: 400,
                    });
                }

                const direccionIPModified = `${direccionIP}:${puerto}`;

                const data = {
                    nombre,
                    ip: direccionIPModified,
                    external_id: uuid.v4(),
                    id_persona: perA.id,
                };

                const transaction = await sequelize.transaction();

                try {
                    const result = await sensor.create(data);

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
        const { nombre, ip: direccionIP, puerto, persona: id_persona } = req.body;

        if (nombre && direccionIP && id_persona && puerto) {
            const external = req.params.external;

            try {
                const sensorA = await models.sensor.findOne({
                    where: { external_id: external },
                });

                const perA = await models.persona.findOne({
                    where: { external_id: req.body.persona },
                });

                if (!perA) {
                    res.status(400);
                    return res.json({ msg: "ERROR", tag: "Rol no existente", code: 400 });
                }
                if (!sensorA) {
                    res.status(400);
                    return res.json({
                        msg: "ERROR",
                        tag: "Sensor no existente",
                        code: 400,
                    });
                }

                if (!ip.isV4Format(direccionIP) && !ip.isV6Format(direccionIP)) {
                    res.status(400);
                    return res.json({
                        message: "Error de solicitud",
                        tag: "Dirección IP inválida",
                        code: 400,
                    });
                }

                if (isNaN(puerto) || puerto <= 0) {
                    res.status(400);
                    return res.json({
                        message: "Error de solicitud",
                        tag: "Puerto no válido o no positivo",
                        code: 400,
                    });
                }

                const direccionIPModified = `${direccionIP}:${puerto}`;

                const data = {
                    nombre,
                    ip: direccionIPModified,
                    external_id: uuid.v4(),
                    id_persona: perA.id,
                };

                const transaction = await models.sequelize.transaction();

                try {
                    await sensorA.update(data);

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

    async buscarporFecha(req, res) {
        const external = req.params.external;
        const fechaEspecifica = req.query.fecha;

        try {
            const reportesPorFecha = await reporte.findAll({
                where: {
                    external_id: external,
                    fecha: fechaEspecifica,
                },
                attributes: ["fecha", "dato", "tipo_dato", "external_id"],
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

    async cambiarEstadoSensor(req, res) {
        const external = req.params.external;

        try {
            const sensorA = await models.sensor.findOne({
                where: { external_id: external },
            });

            if (!sensorA) {
                res.status(404);
                return res.json({
                    message: "Sensor no encontrado",
                    code: 404,
                    data: {},
                });
            }

            const transaction = await models.sequelize.transaction();

            try {
                const nuevoEstado = !sensorA.estado;

                await sensorA.update({ estado: nuevoEstado }, { transaction });

                await transaction.commit();

                res.status(200);
                res.json({
                    message: "Estado del sensor cambiado con éxito",
                    code: 200,
                    nuevoEstado,
                });
            } catch (error) {
                if (transaction) await transaction.rollback();

                res.status(500);
                res.json({
                    message: "Error interno del servidor",
                    code: 500,
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
    }

    async consultarYGuardarDatos() {
        try {
            const lista = await sensor.findAll({
                attributes: ["nombre", "ip", "estado", "external_id", "id"],
                where: { estado: true },
            });

            if (!lista || lista.length === 0) {
                console.error("No hay sensores disponibles para la lectura de datos");
                return;
            }

            const promesas = lista.map(async (element) => {
                try {
                    const response = await axios.get(`http://${element.ip}`);
                    if (!response.data) {
                        console.error(`No se recibieron datos del sensor en la IP: ${element.ip}`);
                        return;
                    }

                    let datosSensor;
                    try {

                        datosSensor = JSON.parse(response.data);

                        const camposEsperados = ["temperatura", "humedad", "presion"];
                        const tieneCamposEsperados = camposEsperados.some(campo => datosSensor.hasOwnProperty(campo));
                        if (!tieneCamposEsperados) {
                            console.error(`Los datos recibidos no contienen campos válidos: ${JSON.stringify(datosSensor)}`);
                            return;
                        }

                        if (typeof datosSensor.temperatura !== 'number' || typeof datosSensor.humedad !== 'number' || typeof datosSensor.presion !== 'number') {
                            console.error(`Los datos recibidos no tienen el formato esperado: ${JSON.stringify(datosSensor)}`);
                            return;
                        }
                    } catch (error) {
                        console.error(`Los datos recibidos no son un JSON válido desde ${element.ip}`);
                        return;
                    }

                    const tipoDatoMapping = {
                        temperatura: "TEMPERATURA",
                        humedad: "HUMEDAD",
                        presion: "PRESION_ATMOSFERICA",
                    };

                    const tipo_dato = Object.keys(datosSensor).find((campo) =>
                        tipoDatoMapping.hasOwnProperty(campo)
                    );
                    console.log(Object.keys(datosSensor).length);

                    for (const tipoDato in datosSensor) {
                        if (datosSensor.hasOwnProperty(tipoDato)) {
                            const data = {
                                dato: datosSensor[tipoDato],
                                tipo_dato: tipoDatoMapping.hasOwnProperty(tipoDato)
                                    ? tipoDatoMapping[tipoDato]
                                    : "HUMEDAD",
                                external_id: uuid(),
                                id_sensor: element.id,
                            };

                            const transaction = await sequelize.transaction();

                            try {
                                const result = await reporte.create(data);

                                await transaction.commit();

                                if (!result) {
                                    console.error("No se pudo crear el informe en la base de datos");
                                }

                                console.log("Datos consultados y guardados:", data);
                            } catch (error) {
                                await transaction.rollback();
                                console.error("Error al guardar datos en la base de datos:", error.message);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error al obtener datos del sensor en la IP: ${element.ip}`, error.message);
                }
            });

            await Promise.all(promesas);
        } catch (error) {
            console.error("Error al consultar y guardar datos:", error.message);
        }
    }

    iniciarTareaPeriodica() {
        cron.schedule("*/60 * * * *", async () => {
            console.log("Ejecutando tarea periódica...");
            await this.consultarYGuardarDatos();
        });
    }

}

module.exports = SensorControl;
