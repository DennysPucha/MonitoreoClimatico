"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { obtener, obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { format, subDays } from "date-fns";
import esLocale from "date-fns/locale/es";
import mensajes from "@/componentes/mensajes";

export default function Page() {
  const [historial, setHistorial] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fechaSeleccionada = format(selectedDate, "yyyy-MM-dd", { locale: esLocale });

    const consultarAPI = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/monitoreo/resumenFecha/reportes?fecha=${fechaSeleccionada}`
        );
        const data = await response.json();
        setReportes([data.data]); // Almacenar los datos en un array para que coincida con la estructura anterior
      } catch (error) {
        console.error(`Error al consultar la API para la fecha ${fechaSeleccionada}:`, error);
        setReportes([]); // Reiniciar los reportes en caso de error
      }
    };

    consultarAPI();
  }, [selectedDate]);

  return (
    <div className="container mt-4">
      {/* Resto del código... */}

      <div className="d-flex flex-column align-items-center">
        <h1 className="text-white">Historial</h1>

        {/* Selector de fecha */}
        <div className="mb-3">
          <label htmlFor="filtroFecha" className="mr-2">
            Selecciona una fecha:
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          className="btn btn-primary"
          onClick={() => consultarAPI()}
        >
          Buscar en la fecha
        </button>

        {/* Tabla de datos */}
        <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Temperatura en el día</th>
                <th>Humedad en el día</th>
                <th>Presión Atmosférica en el día</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte, index) => (
                <tr key={index}>
                  <td>{format(selectedDate, "yyyy-MM-dd", { locale: esLocale })}</td>
                  <td>{reporte?.datoMasRecurrenteTemperatura || "No hay datos"}</td>
                  <td>{reporte?.datoMasRecurrenteHumedad || "No hay datos"}</td>
                  <td>{reporte?.datoMasRecurrentePresionAtmosferica || "No hay datos"}</td>
                  <td>
                    {reporte.fecha && (
                      <Link href={`cargarDataDay/${String(reporte.fecha)}`} passHref>
                        <button className="btn btn-primary">ver detalle</button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}