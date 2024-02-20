'use client';
import ChartComponent from '@/componentes/grafica';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import MenuInicio from '@/componentes/menuInicio';
import tarjetasPronosticos from '@/componentes/tarjetasPronostico';
import { obtener } from '@/hooks/Conexion';
import TarjetasPronosticos from '@/componentes/tarjetasPronostico';

const Page = () => {
    const [ultimosReportes, setUltimosReportes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await obtener("ultimoReporte/reportes/");
                setUltimosReportes(response.data);
                console.log("esta es la respuest", response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    console.log(ultimosReportes);


    const router = useRouter();

    const handleUpdateChart = () => {
        router.push("/pronostico");

    };

    return (
        <div style={styles.container} >
            <header>

                <MenuInicio></MenuInicio>



            </header>
            <header style={styles.header}>
                <h1 style={styles.title2}>Temperatura actual</h1>
            </header>
            <section style={styles.mainSection}>
                <div style={styles.moteContainer}>
                    <div style={styles.moteCard}>
                        <h2>{ultimosReportes.reporteTemperatura ? ultimosReportes.reporteTemperatura.sensor.nombre : '0.00'}</h2>
                        <p>Temperatura: {ultimosReportes.reporteTemperatura ? Math.round(ultimosReportes.reporteTemperatura.dato) + ' °C' : '0.00'}</p>
                        <p>Humedad: {ultimosReportes.reporteHumedad ? Math.round(ultimosReportes.reporteHumedad.dato) + ' %' : '0.00'}</p>
                        <p>Presión: {ultimosReportes.reportePresionAtmosferica ? Math.round(ultimosReportes.reportePresionAtmosferica.dato) + ' hPa' : '0.00'}</p>
                    </div>
                </div>
                <TarjetasPronosticos></TarjetasPronosticos>
                <p></p>
                <button style={styles.button} onClick={handleUpdateChart}>Ver detalles</button>

            </section>
            <div>
                {/* <ChartComponent></ChartComponent> */}
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '40px',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.00)'
    },
    header: {
        marginBottom: '20px',
    },
    title: {
        fontSize: '50px',
        fontWeight: 'bold',
        color: 'black',
    },
    title2: {
        fontSize: '40px',
        fontWeight: 'bold',
        color: 'white   ',
    },
    mainSection: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    moteContainer: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', // Ajuste para centrar horizontalmente
        alignItems: 'center', // Ajuste para centrar verticalmente
        marginBottom: '5px',
    },

    moteCard: {
        flex: '1',
        maxWidth: '300px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'rgba(1, 1, 1, 0.5)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '0 auto', // Ajuste para centrar horizontalmente
    },

    button: {
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Page;
