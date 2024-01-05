import React from 'react';

const weatherData = [
    { time: '1:00', humidity: '24%', windSpeed: '7km/h', windDirection: 'SSE', temperature: '14°' },
    { time: '2:00', humidity: '24%', windSpeed: '6km/h', windDirection: 'SSE', temperature: '14°' },
    // ... y así sucesivamente con los demás datos de tiempo.
 ];
export default function Page() {
    return (
<div>
      <h1>Monitoreo climático</h1>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Humedad</th>
            <th>Velocidad del viento</th>
            <th>Dirección del viento</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((data, index) => (
            <tr key={index}>
              <td>{data.time}</td>
              <td>{data.humidity}</td>
              <td>{data.windSpeed}</td>
              <td>{data.windDirection}</td>
              <td>{data.temperature}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}