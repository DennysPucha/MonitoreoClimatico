'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Principal() {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const externalUser = getExternalUser();

      try {
        const response = await obtenerTodo("listar/reportes", token);
        setReportes(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center">
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
            <p>No se encontraron reportes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
