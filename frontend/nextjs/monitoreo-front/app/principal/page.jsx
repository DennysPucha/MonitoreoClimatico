"use client"
import ChartComponent from '@/componentes/grafica';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";



const Page = () => {
    const router = useRouter();

    const [data, setData] = useState({
        mote1: { temperature: 0, humidity: 0, pressure: 0 },
        mote2: { temperature: 0, humidity: 0, pressure: 0 },
        mote3: { temperature: 0, humidity: 0, pressure: 0 },
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            const getRandomData = () => ({
                temperature: getRandomNumber(20, 30),
                humidity: getRandomNumber(40, 60),
                pressure: getRandomNumber(1000, 1010),
            });

            setData({
                mote1: getRandomData(),
                mote2: getRandomData(),
                mote3: getRandomData(),
            });
        }, 2000); // Actualiza cada 2 segundos

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, []);

    const getRandomNumber = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const renderMoteCard = (moteName, moteData) => {
        return (
            <div style={styles.moteCard} key={moteName}>
                <h2>{moteName}</h2>
                <p>Temperatura: {moteData.temperature.toFixed(2)} °C</p>
                <p>Humedad: {moteData.humidity.toFixed(2)} %</p>
                <p>Presión: {moteData.pressure.toFixed(2)} hPa</p>
            </div>
        );
    };

    const handleUpdateChart = () => {
        router.push("/pronostico");
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Bienvenido a nuestra Página Principal</h1>
                <h1>
                    Temperatura promedio
                    40°C
                </h1>
            </header>

            <section style={styles.mainSection}>
                <div style={styles.moteContainer}>
                    {renderMoteCard('Mote 1', data.mote1)}
                    {renderMoteCard('Mote 2', data.mote2)}
                    {renderMoteCard('Mote 3', data.mote3)}
                </div>
                <ChartComponent></ChartComponent>
                <p></p>
                <button style={styles.button} onClick={handleUpdateChart}>Ver detalles</button>
            </section>

        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
    },
    header: {
        marginBottom: '30px',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#333',
    },
    mainSection: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    moteContainer: {
        display: 'flex',
        flexDirection: 'row',  // Cambiado a fila
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    moteCard: {
        flex: '1',
        maxWidth: '200px',  // Ajusta el ancho según tus necesidades
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
