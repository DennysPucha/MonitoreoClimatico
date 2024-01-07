'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { format, isAfter, isToday } from "date-fns";
import esLocale from "date-fns/locale/es";
import { obtenerReportesPorFecha } from "@/hooks/obtenerPorFecha";

export default function Page({ params }) {
  const { fecha } = params;
  console.log(fecha);
  const [reportes, setReportes] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        const response = await obtenerReportesPorFecha(filtroFecha);
        const reportesAgrupados = groupAndSelectMaxTipoDato(response.data);
        setReportes(reportesAgrupados);
        setSinResultados(Object.keys(reportesAgrupados).length === 0);
        console.log(response);
      } catch (error) {
        console.error(error);
        setSinResultados(true);
      }
    };

    fetchData();
  }, [filtroFecha]);

  const groupAndSelectMaxTipoDato = (reportes) => {
    const reportesAgrupados = {};

    reportes.forEach((reporte) => {
      const fechaFormateada = format(new Date(reporte.fecha), "yyyy-MM-dd", {
        locale: esLocale,
      });

      if (!reportesAgrupados[fechaFormateada]) {
        reportesAgrupados[fechaFormateada] = reporte;
      } else {
        if (reporte.tipo_dato > reportesAgrupados[fechaFormateada].tipo_dato) {
          reportesAgrupados[fechaFormateada] = reporte;
        }
      }
    });

    return reportesAgrupados;
  };

  const handleBuscarPorFecha = () => {
    fetchData();
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1 className="text-white">Historial</h1>
      <div className="mb-3">
        <label htmlFor="filtroFecha" className="mr-2">
          Filtrar por fecha:
        </label>
        <input
          type="date"
          id="filtroFecha"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          max={isToday(new Date()) ? format(new Date(), "yyyy-MM-dd") : ""}
        />
        <button className="btn btn-primary ml-2" onClick={handleBuscarPorFecha}>
          Buscar
        </button>
      </div>
      <div className="row">
        <div className="col-12 table-responsive">
          {Object.keys(reportes).length > 0 ? (
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
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(reportes).map((fechaAgrupada, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fechaAgrupada}</td>
                    <td>{reportes[fechaAgrupada].dato}</td>
                    <td>{reportes[fechaAgrupada].tipo_dato}</td>

                    <td>
                      {reportes[fechaAgrupada].external_id && (
                        <Link href={`reportes/${reportes[fechaAgrupada].fecha}`} passHref>
                          <button className="btn btn-primary">Ver detalle</button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              {sinResultados
                ? `No se encontraron reportes para la fecha ${filtroFecha}.`
                : "No se encontraron reportes."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
