import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = () => {
    const [chartData, setChartData] = useState(generateRandomData());

    useEffect(() => {
        const ctx = document.getElementById('grafica').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
        });

        return () => {
            myChart.destroy();
        };
    }, [chartData]);

    const handleUpdateChart = () => {
        setChartData(generateRandomData());
    };

    return (
        <div>
            <h1>Ejemplo 1 - Gráfica de líneas</h1>
            <canvas id="grafica"></canvas>
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
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Presión',
                data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Humedad',
                data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };
};

export default ChartComponent;
