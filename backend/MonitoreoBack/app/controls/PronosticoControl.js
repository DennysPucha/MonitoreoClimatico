'use estrict';

const models = require('../models');
const { reporte, sensor } = models;

class PronosticoControl {
    obtenerUltimoRegistro = async (req, res) => {
        try {
            const tiposDatoEnum = ['TEMPERATURA', 'HUMEDAD', 'PRESION_ATMOSFERICA'];
            const resultados = {};

            // Iterar sobre cada valor del enum y realizar la consulta
            await Promise.all(
                tiposDatoEnum.map(async tipoDato => {
                    const ultimoRegistro = await reporte.findOne({
                        attributes: ['tipo_dato', 'dato', 'id_sensor'], // Incluir id_sensor en los atributos seleccionados
                        include: [
                            {
                                model: sensor,
                                attributes: ['nombre'] // Incluir el nombre del sensor en los atributos seleccionados
                            }
                        ],
                        where: { tipo_dato: tipoDato },
                        order: [['id', 'DESC']],
                        limit: 1
                    });

                    // Almacenar el resultado en el objeto de resultados
                    resultados[tipoDato] = ultimoRegistro
                        ? {
                            tipo_dato: ultimoRegistro.tipo_dato,
                            dato: ultimoRegistro.dato,
                            sensor: ultimoRegistro.sensor ? ultimoRegistro.sensor.nombre : null
                        }
                        : null;
                })
            );

            // Verificar si se encontraron registros
            const registrosEncontrados = tiposDatoEnum.some(tipoDato => resultados[tipoDato]);
            if (!registrosEncontrados) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: resultados });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    };


}

module.exports = PronosticoControl;