"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtener } from "@/hooks/Conexion";
import Swal from "sweetalert2";
import Chart from 'chart.js/auto';
import Menu from "@/componentes/menuInicio";
const Page = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [parameter, setParameter] = useState("TEMPERATURA");
    const [resumen, setResumen] = useState([]);
    const [chart, setChart] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleParameterChange = (event) => {
        setParameter(event.target.value);
    };

    const handleGetData = async () => {
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        const response = await obtener(`resumenRangoFechas/reportes/?fechaInicio=${formattedStartDate}&fechaFin=${formattedEndDate}&tipoDato=${parameter}`);
        if (response.code === 200) {
            setResumen(response.data);
            generateChart(response.data);
        } else {
            console.error(response.msg);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener los datos. Por favor, inténtalo de nuevo.',
            });
        }
    };

    const generateChart = (data) => {
        const ctx = document.getElementById('myChart').getContext('2d');
        if (chart) {
            chart.destroy();
        }
        const labels = Object.keys(data);
        const values = labels.map(date => data[date][parameter]);
        const backgroundColor = 'white';
        const borderColor = 'white';
        const pointBackgroundColor = 'rgba(173, 216, 230, 1)';
        const chartData = {
            labels: labels,
            datasets: [{
                label: parameter,
                data: values,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
                pointBackgroundColor: pointBackgroundColor, // Color de los puntos
                pointRadius: 5, // Tamaño de los puntos
                pointHoverRadius: 7, // Tamaño de los puntos al pasar el ratón
                tension: 0.4 // Curvas suavizadas
            }]
        };

        // Determinar el rango de valores mostrados en el eje y
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const yPadding = Math.max((maxValue - minValue) * 0.1, 1); // Espacio adicional del 10%

        const newChart = new Chart(ctx, {
            type: 'line', // Cambiar el tipo de gráfico a línea
            data: chartData,
            options: {
                scales: {
                    y: {
                        min: minValue - yPadding, // Establecer el valor mínimo del eje y
                        max: maxValue + yPadding, // Establecer el valor máximo del eje y
                        ticks: {
                            color: 'white'
                        },
                        beginAtZero: false // Comenzar el eje y en el valor mínimo
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                elements: {
                    line: {
                        tension: 0.4 // Curvas suavizadas
                    }
                }
            }
        });
        setChart(newChart);
    };
    return (
        <div>
            <Menu></Menu>
            <div className="container vh-100 d-flex align-items-center justify-content-center">

                <div className="row justify-content-center">
                    {/* <div className="col-12 text-center" style={{ marginBottom: "4em" }}>
                        <h1 className="fw-bold">Gráfico de Datos Climáticos</h1>
                    </div> */}
                    <div className="col-6">
                        <label className="form-label">Fecha de Inicio</label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            maxDate={endDate}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Fecha de Fin</label>
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            minDate={startDate}
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                        />
                    </div>
                    <div className="col-6 mt-4">
                        <button onClick={handleGetData} className="btn btn-primary w-100">Obtener Datos</button>
                    </div>
                    <div className="col-6 mt-4">
                        <select value={parameter} onChange={handleParameterChange} className="form-select">
                            <option value="TEMPERATURA">Temperatura</option>
                            <option value="HUMEDAD">Humedad</option>
                            <option value="PRESION_ATMOSFERICA">Presión Atmosférica</option>
                        </select>
                    </div>
                    <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded d-flex align-items-center" style={{ marginTop: "2em" }}>
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;