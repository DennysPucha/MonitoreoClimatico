import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = () => {
    const [chartData, setChartData] = useState(generateRandomData());

    useEffect(() => {
        const ctx = document.getElementById('grafica').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    x: {
                        grid: {
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                        },
                    },
                    y: {
                        grid: {
                            color: 'black',
                        },
                        ticks: {
                            color: 'black',
                        },
                    },
                },
            },
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    const handleUpdateChart = () => {
        setChartData(generateRandomData());
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            width: '700px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            color: 'white'
        }}>
            <div style={{ width: '100%' }}>
                <h1 style={{ color: 'Grey', textAlign: 'center' }}>Pronóstico</h1>
                <canvas id="grafica"></canvas>
            </div>
        </div>
    );
};

const generateRandomData = () => {
    return {
        labels: Array.from({ length: 10 }, (_, i) => `Data ${i + 1}`),
        datasets: [
            {
                label: 'Temperatura',
                data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'red',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Presión',
                data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Humedad',
                data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'black',
                borderWidth: 2,
                fill: false,
            },
        ],
    };
};

export default ChartComponent;
