"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Page({ params }) {
  const { external } = params;
  const [reportes, setReportes] = useState([]);
  const [horaInicio, setHoraInicio] = useState("00:00");
  const [horaFin, setHoraFin] = useState("23:59");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = getToken();
    const externalUser = getExternalUser();

    try {
      const response = await obtenerTodo(`obtener/sensorReportes/${external}`, token);
      setReportes(response.data.reporte);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuscarPorRangoHoras = async () => {
    const token = getToken();

    try {
      const response = await obtenerTodo(
        `buscar/reporte?external=${external}&horaInicio=${horaInicio}&horaFin=${horaFin}`,
        token
      );
      setReportes(response.data.reporte);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row mt-3">
        <Link href="/sensores" passHref>
          <button className="btn btn-success">Volver</button>
        </Link>
        <div className="col text-center">
          <div className="bg-primary p-3">
            <h1 className="text-white">Reportes del sensor</h1>
          </div>
          <div className="mt-3">
            <div
              className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
              style={{ maxHeight: "300px" }} 
            >
              <div className="mb-3">
                <label htmlFor="horaInicio" className="me-2">
                  Hora de inicio:
                </label>
                <input
                  type="time"
                  id="horaInicio"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
                <label htmlFor="horaFin" className="mx-2">
                  Hora de fin:
                </label>
                <input
                  type="time"
                  id="horaFin"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                />
                <button className="btn btn-primary ms-2" onClick={handleBuscarPorRangoHoras}>
                  Buscar por Rango de Horas
                </button>
              </div>
              {Array.isArray(reportes) && reportes.length > 0 ? (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nro</th>
                        <th>Fecha</th>
                        <th>Hora Registro</th>
                        <th>Dato</th>
                        <th>Tipo Dato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportes.map((reporte, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{reporte.fecha}</td>
                          <td>{reporte.hora_registro}</td>
                          <td>{reporte.dato}</td>
                          <td>{reporte.tipo_dato}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No se encontraron reportes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
