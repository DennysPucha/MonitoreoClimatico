"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Principal() {
  const [reportes, setreportes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const externalUser = getExternalUser();

      try {
        const response = await obtenerTodo("listar/reportes", token);
        setreportes(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {Array.isArray(reportes) && reportes.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Dato</th>
                <th>Tipo Dato</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{reporte.fecha}</td>
                  <td>{reporte.dato}</td>
                  <td>{reporte.tipo_dato}</td>
                  <td>
                    {reporte.external_id && (
                      <Link href={`editreporte/${reporte.external_id}`} passHref>
                        <button className="btn btn-success">Editar</button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron reportes.</p>
      )}
    </div>
  );
}