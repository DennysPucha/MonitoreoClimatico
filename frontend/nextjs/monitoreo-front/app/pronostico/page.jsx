"use client";
import React, { useState } from 'react';
import faker from 'faker';

const generateRandomData = () => {
    return {
        ciudad: faker.address.city(),
        temperatura: `${faker.random.number({ min: -10, max: 40 })}°C`,
        humedad: `${faker.random.number({ min: 20, max: 80 })}%`,
        estado: faker.random.arrayElement(['Despejado', 'Nublado', 'Lluvia', 'Tormenta']),
    };
};

const WeatherTable = ({ rowCount }) => {
    const [data, setData] = useState(Array.from({ length: rowCount }, generateRandomData));

    const regenerateData = () => {
        setData(Array.from({ length: rowCount }, generateRandomData));
    };

    return (
        <div>
            <button onClick={regenerateData}>Generar Nuevos Datos</button>
            <table>
                <thead>
                    <tr>
                        <th>Ciudad</th>
                        <th>Temperatura</th>
                        <th>Humedad</th>
                        <th>Estado del Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.ciudad}</td>
                            <td>{row.temperatura}</td>
                            <td>{row.humedad}</td>
                            <td>{row.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WeatherTable;
