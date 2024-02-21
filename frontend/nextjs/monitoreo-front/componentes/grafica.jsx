import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { obtener } from '@/hooks/Conexion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const chartOptions = {
    scales: {
        y: {
            min: 0,
        },
        x: {
            ticks: { color: 'rgb(255, 100, 132)' },
        },
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.dataset.label || '';
                    if (context.parsed.x !== null) {
                        const fechaHora = context.dataset.data[context.dataIndex].hora_registro;
                        const fecha = context.dataset.data[context.dataIndex].fecha;
                        const dato = context.parsed.y;
                        return `${label}: ${dato} en ${fechaHora} - ${fecha}`;
                    }
                    return '';
                },
            },
        },
    },
};

export default function LinesChart() {
    const [reportesHumedad, setReportesHumedad] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await obtener("listar/reportes/ultimos");
                setReportesHumedad(response.data);
                console.log("Respuesta del reporte de humedad:", response);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const humedadData = reportesHumedad.map(report => ({
        fecha: report.fecha,
        dato: parseFloat(report.dato),
        hora_registro: report.hora_registro
    }));

    const chartData1 = {
        labels: humedadData.map(data => data.hora_registro),
        datasets: [
            {
                label: 'Humedad',
                data: humedadData.map(data => data.dato),
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(255, 99, 132)',
                pointBackgroundColor: 'rgba(255, 99, 132)',
            },
        ],
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <Line data={chartData1} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
