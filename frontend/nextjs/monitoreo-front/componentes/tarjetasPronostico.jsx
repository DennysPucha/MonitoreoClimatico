import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { WiThermometer, WiHumidity, WiBarometer } from 'react-icons/wi';
import { obtener } from '@/hooks/Conexion';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function TarjetasPronosticos() {
    const [pronosticosRangos, setPronosticosRangos] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchPronosticosRangos = async () => {
            try {
                const response = await obtener('obtener/rangos/');
                setPronosticosRangos(response.data);

                const today = new Date();
                const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
                setCurrentDate(formattedDate);

                console.log('Esta es la respuesta:', response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPronosticosRangos();
    }, []);

    const clasificarPorPeriodo = (hora) => {
        const horaInt = parseInt(hora, 10);

        if (horaInt >= 6 && horaInt < 12) {
            return 'Mañana';
        } else if (horaInt >= 12 && horaInt < 18) {
            return 'Tarde';
        } else {
            return 'Noche';
        }
    };

    const agruparPronosticos = () => {
        const pronosticosAgrupados = {};

        pronosticosRangos.forEach((pronostico) => {
            const fecha = pronostico.fecha;
            const periodo = clasificarPorPeriodo(pronostico.hora);

            if (!pronosticosAgrupados[fecha]) {
                pronosticosAgrupados[fecha] = {
                    Mañana: { temperatura: [], humedad: [], presion: [] },
                    Tarde: { temperatura: [], humedad: [], presion: [] },
                    Noche: { temperatura: [], humedad: [], presion: [] },
                };
            }

            pronosticosAgrupados[fecha][periodo].temperatura.push(pronostico);
            pronosticosAgrupados[fecha][periodo].humedad.push(pronostico);
            pronosticosAgrupados[fecha][periodo].presion.push(pronostico);
        });

        return pronosticosAgrupados;
    };

    const renderMomento = (pronosticosMomento, tipoPronostico) => {
        if (pronosticosMomento.length > 0) {
            return (
                <div key={tipoPronostico}>
                    <h6>{tipoPronostico}:</h6>
                    {pronosticosMomento.map((pronostico, index) => (
                        <div key={index} className="text-center">
                            {pronostico.tipo_pronostico === 'TEMPERATURA' && <WiThermometer />}
                            {pronostico.tipo_pronostico === 'HUMEDAD' && <WiHumidity />}
                            {pronostico.tipo_pronostico === 'PRESION_ATMOSFERICA' && <WiBarometer />}:
                            {parseFloat(pronostico.dato).toFixed(2)}
                            {pronostico.tipo_pronostico === 'PRESION_ATMOSFERICA' ? 'hPa' : pronostico.tipo_pronostico === 'HUMEDAD' ? '%' : '°C'}
                            <br />
                        </div>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };

    const renderPronosticos = () => {
        const pronosticosAgrupados = agruparPronosticos();

        return (
            <div id="pronosticosCarousel" className="carousel slide" data-bs-ride="carousel">
                <style>
                    {`
                        .custom-carousel-background {
                            background-color: #1119; /* Color de fondo verde claro */
                            border-radius: 30px; /* Bordes redondeados, ajusta según sea necesario */
                            padding: 20px; /* Ajusta el espaciado interior según sea necesario */
                        }
                    `}
                </style>
                <div className="carousel-inner custom-carousel-background">
                    {Object.keys(pronosticosAgrupados).map((fecha, index) => (
                        <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                            <Container>
                                <h4>{fecha === currentDate ? 'Hoy' : fecha}</h4>
                                <Row className="g-2">
                                    <Col className="text-center">{renderMomento(pronosticosAgrupados[fecha]['Mañana'].temperatura, 'Mañana')}</Col>
                                    <Col className="text-center">{renderMomento(pronosticosAgrupados[fecha]['Tarde'].temperatura, 'Tarde')}</Col>
                                    <Col className="text-center">{renderMomento(pronosticosAgrupados[fecha]['Noche'].temperatura, 'Noche')}</Col>
                                </Row>
                            </Container>
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#pronosticosCarousel" data-bs-slide="prev" onClick={() => setActiveIndex((prevIndex) => (prevIndex === 0 ? Object.keys(pronosticosAgrupados).length - 1 : prevIndex - 1))}>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#pronosticosCarousel" data-bs-slide="next" onClick={() => setActiveIndex((prevIndex) => (prevIndex === Object.keys(pronosticosAgrupados).length - 1 ? 0 : prevIndex + 1))}>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        );
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4" style={{ color: 'white' }}>Pronóstico próximos 7 días</h2>
            {pronosticosRangos.length > 0 ? renderPronosticos() : <p>Cargando...</p>}
        </Container>
    );
}
