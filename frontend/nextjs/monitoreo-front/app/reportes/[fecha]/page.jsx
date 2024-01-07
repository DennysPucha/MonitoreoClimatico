'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { obtenerReportesPorFecha } from "@/hooks/obtenerPorFecha";

export default function Page({ params }) {
  const { fecha } = params;
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        const response = await obtenerReportesPorFecha(fecha);
        setReportes(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const calcularPromedioHumedad = () => {
    if (reportes.length === 0) {
      return null;
    }

    const humedadReports = reportes.filter((reporte) => reporte.tipo_dato === "HUMEDAD");
    if (humedadReports.length === 0) {
      return null;
    }

    const sumaHumedad = humedadReports.reduce((sum, reporte) => sum + parseFloat(reporte.dato), 0);
    const promedioHumedad = sumaHumedad / humedadReports.length;

    return promedioHumedad.toFixed(2); 
  };

  const promedioHumedad = calcularPromedioHumedad();

  return (
    <div className="container mt-4">
      <h1 className="text-white">Reporte del día</h1>
    
      {promedioHumedad !== null && (
        <div className="mb-3">
          <p>Promedio de Humedad: {promedioHumedad}%</p>
        </div>
      )}

      {reportes.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Hora</th>
              <th scope="col">Dato</th>
              <th scope="col">Tipo Dato</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{reporte.hora_registro}</td>
                <td>{reporte.dato}</td>
                <td>{reporte.tipo_dato}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay reporte de ese día en especifico</p>
      )}
    </div>
  );
}
