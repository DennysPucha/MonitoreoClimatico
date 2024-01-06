'use client';
import React, { useEffect, useState } from "react";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Principal() {

  const [reportes, setReportes] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = getToken();

    try {

      const endpoint = filtroFecha
        ? `buscarporFecha/reporte?fecha=${filtroFecha}`
        : "listar/reportes";
      console.log(filtroFecha);
      const response = await obtenerTodo(endpoint, token);
      setReportes(response.data);
      setSinResultados(response.data.length === 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBuscarPorFecha = () => {
    fetchData();
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <div className="mb-3">
        <label htmlFor="filtroFecha" className="mr-2">
          Filtrar por fecha:
        </label>
        <input
          type="date"
          id="filtroFecha"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        <button className="btn btn-primary ml-2" onClick={handleBuscarPorFecha}>
          Buscar
        </button>
      </div>
      <div className="row">
        <div className="col-12 table-responsive">
          {Array.isArray(reportes) && reportes.length > 0 ? (
            <table
              className="table table-hover table-bordered table-striped"
              style={{ backgroundColor: "#e6f7ff", fontSize: "18px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Dato</th>
                  <th>Tipo Dato</th>
                </tr>
              </thead>
              <tbody>
                {reportes.map((reporte, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{reporte.fecha}</td>
                    <td>{reporte.dato}</td>
                    <td>{reporte.tipo_dato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              {sinResultados
                ? "No se encontraron reportes para la fecha especificada."
                : "No se encontraron reportes."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
