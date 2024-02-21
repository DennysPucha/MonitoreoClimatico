"use strict";

const uuid = require('uuid');
const models = require('../models');
const { pronostico, sequelize } = models;
const { Op } = require('sequelize');


class PronosticoControl {
    async listar(req, res) {
        try {
            const lista = await pronostico.findAll({
                attributes: [
                    "fecha",
                    "hora",
                    "dato",
                    "tipo_pronostico",
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
        const { fecha, tipo_pronostico, hora, dato, clima } = req.body;

        if (fecha && tipo_pronostico && hora && dato) {
            // Validar el tipo de pronóstico utilizando Sequelize
            if (!['TEMPERATURA', 'HUMEDAD', 'PRESION_ATMOSFERICA'].includes(tipo_pronostico)) {
                res.status(400);
                return res.json({ message: "Error de solicitud", tag: "Tipo de pronóstico incorrecto", code: 400 });
            }

            try {
                const data = {
                    fecha,
                    hora,
                    dato,
                    tipo_pronostico,
                    climatologia: clima,
                    external_id: uuid.v4(),
                };

                const transaction = await sequelize.transaction();

                try {
                    // // Eliminar registros anteriores
                    // await pronostico.destroy({ truncate: true });

                    const result = await pronostico.create(data);

                    await transaction.commit();

                    if (!result) {
                        res.status(401);
                        return res.json({ message: "Error de creación", tag: "No se puede crear", code: 401 });
                    }

                    res.status(200);
                    res.json({ message: "Éxito", code: 200 });
                } catch (error) {
                    await transaction.rollback();
                    res.status(203);
                    res.json({ message: "Error de procesamiento", code: 203, error: error.message });
                }
            } catch (error) {
                res.status(500);
                res.json({ message: "Error interno del servidor", code: 500, error: error.message });
            }
        } else {
            res.status(400);
            res.json({ message: "Error de solicitud", tag: "Datos incorrectos", code: 400 });
        }
    }

    async eliminarTodosRegistros(req, res) {
        try {
            await pronostico.destroy({ truncate: true });

            res.status(200);
            res.json({ message: "Éxito, se eliminaron los pronosticos anteriores", code: 200 });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtenerMananaTardeNoche(req, res) {
        try {
            const lista = await pronostico.findAll({
                attributes: [
                    "fecha",
                    "hora",
                    "dato",
                    "tipo_pronostico",
                    "external_id",
                ],
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                sequelize.where(sequelize.fn('hour', sequelize.col('hora')), 7),
                                sequelize.where(sequelize.fn('minute', sequelize.col('hora')), { [Op.gte]: 0 }),
                            ],
                        },
                        {
                            [Op.and]: [
                                sequelize.where(sequelize.fn('hour', sequelize.col('hora')), 14),
                                sequelize.where(sequelize.fn('minute', sequelize.col('hora')), { [Op.gte]: 0 }),
                            ],
                        },
                        {
                            [Op.and]: [
                                sequelize.where(sequelize.fn('hour', sequelize.col('hora')), 19),
                                sequelize.where(sequelize.fn('minute', sequelize.col('hora')), { [Op.gte]: 0 }),
                            ],
                        },
                    ],
                },
            });

            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({
                message: "Error interno del servidor",
                code: 500,
                error: error.message,
            });
        }
    }

    async buscarporFecha(req, res) {
        const { fecha, tipo_pronostico: tipo_pronostico } = req.query;

        try {
            if (!fecha) {
                return res.status(400).json({
                    message: "Error de solicitud",
                    tag: "Datos incorrectos",
                    code: 400
                });
            }

            const fechaInicio = new Date(`${fecha}T00:00:00Z`);
            const fechaFin = new Date(`${fecha}T23:59:59Z`);

            const whereClause = {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
            };

            if (tipo_pronostico) {
                whereClause.tipo_pronostico = tipo_pronostico;
            }

            const listaEncontrados = await pronostico.findAll({
                attributes: [
                    "fecha",
                    "hora",
                    "dato",
                    "tipo_pronostico",
                    "external_id",
                ],
                where: whereClause,
            });

            if (listaEncontrados.length === 0) {
                return res.status(404).json({ message: "No se encontraron registros", code: 404 });
            }

            return res.status(200).json({ message: "Éxito", code: 200, data: listaEncontrados });
        } catch (error) {
            console.error("Error en buscarPorFecha:", error);
            return res.status(500).json({
                message: "Error interno del servidor",
                code: 500,
                error: error.message,
            });
        }
    }



}

module.exports = PronosticoControl;


