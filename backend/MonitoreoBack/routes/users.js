'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PersonaController = require('../app/controls/PersonaControl');
const RolController = require('../app/controls/RolControl');
const CuentaController = require('../app/controls/CuentaControl');
const SensorController = require('../app/controls/SensorControl');
const ReporteController = require('../app/controls/ReporteControl');
const PronosticoControl = require('../app/controls/PronosticoControl');

const personaController = new PersonaController();
const rolController = new RolController();
const cuentaController = new CuentaController();
const sensorController = new SensorController();
const reporteControler = new ReporteController();
const pronosticoControl = new PronosticoControl();

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

const middlewareAutentificacion = async (req, res, next) => {
    try {
        const token = req.headers['token-monitoreo'];

        if (!token) {
            return res.status(401).json({ message: "Falta Token", code: 401 });
        }

        require('dotenv').config();
        const key = process.env.KEY_SEC;

        try {
            const decoded = jwt.verify(token, key);
            console.log(decoded.external);

            const models = require('../app/models');
            const cuenta = models.cuenta;

            const aux = await cuenta.findOne({
                where: { external_id: decoded.external }
            });

            if (!aux) {
                return res.status(401).json({ message: "ERROR", tag: 'Token no válido', code: 401 });
            }
            req.user = aux;
            next();
        } catch (err) {
            return res.status(401).json({ message: "ERROR", tag: 'Token no válido o expirado', code: 401 });
        }
    } catch (error) {
        console.error("Error en el middleware:", error);
        return res.status(500).json({ message: "Error interno del servidor", code: 500 });
    }
};

router.get('/listar/roles', rolController.listar);
router.post('/guardar/roles', rolController.guardar);

router.post('/iniciar_sesion', cuentaController.inicio_sesion);
router.get('/listar/cuentas', cuentaController.listar);


router.get('/listar/personas', personaController.listar);
router.post('/modificar/persona/:external', personaController.modificar);
router.post('/guardar/personas', personaController.guardar);
router.get('/obtener/persona/:external', personaController.obtener);

router.get('/obtener/sensor/:external', sensorController.obtener);
router.get('/obtener/sensorReportes/:external', sensorController.obtenerReportes);
router.get('/listar/sensores', sensorController.listar);
router.post('/modificar/sensor/:external', sensorController.modificar);
router.post('/guardar/sensor', sensorController.guardar);
router.post('/cambiar/estado/sensor/:external', sensorController.cambiarEstadoSensor);

router.get('/listar/reportes', reporteControler.listar);
router.post('/modificar/reporte/:external', middlewareAutentificacion, reporteControler.modificar);
router.post('/guardar/reporte', middlewareAutentificacion, reporteControler.guardar);
router.get('/obtener/reporte/:external', reporteControler.obtener);
router.get('/buscar/reportes/:external', reporteControler.buscar);
router.get('/buscarporFecha/reportes/', reporteControler.buscarporFecha);
router.get('/buscarporFechaYTipoDato/reportes/', reporteControler.buscarporFechaYTipoDato);
router.get('/resumenFecha/reportes/', reporteControler.resumenPorFecha);
router.get('/resumenRangoFechas/reportes/', reporteControler.resumenPorRangoDeFechas);
router.get('/ultimoReporte/reportes/', reporteControler.ultimoReporte);


router.get('/buscarporFecha/determinarClima', reporteControler.determinarClima);
//router.post('/borrar/reportes', reporteControler.borrarTodosLosDatos);


router.get('/listar/pronosticos', pronosticoControl.listar);
router.post('/guardar/pronostico', pronosticoControl.guardar);
router.delete('/eliminar/pronostico', pronosticoControl.eliminarTodosRegistros);
router.get('/obtener/rangos/', pronosticoControl.obtenerMananaTardeNoche);
router.get('/buscarporFecha/pronosticos/', pronosticoControl.buscarporFecha);

sensorController.iniciarTareaPeriodica();


module.exports = router;
