'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { format, isAfter, isToday } from "date-fns";
import esLocale from "date-fns/locale/es";
import { obtenerReportesPorFecha } from "@/hooks/obtenerPorFecha";
import css from "styled-jsx/css";

export default function Page({ params }) {
  const { fecha } = params;
  console.log(fecha);
  const [reportes, setReportes] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    // Cargar todos los reportes al montar el componente
    const cargarTodosLosReportes = async () => {
      const token = getToken();
      try {
        const response = await obtenerTodo(); // Reemplaza con la función correcta para obtener todos los reportes
        const reportesAgrupados = groupAndSelectMaxTipoDato(response.data);
        setReportes(reportesAgrupados);
        setSinResultados(Object.keys(reportesAgrupados).length === 0);
        console.log(response);
      } catch (error) {
        console.error(error);
        setSinResultados(true);
      }
    };

    cargarTodosLosReportes();
  }, []); // El segundo parámetro (deps) es un array vacío, lo que indica que se ejecutará solo una vez al montar el componente.

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

  const handleBuscarPorFecha = async () => {
    // Si deseas mantener la funcionalidad de búsqueda, puedes agregarla aquí
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

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link href="/">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2383/2383684.png"
              alt="Logo"
              className="navbar-brand"
              style={{ width: "70px", height: "70px" }} // Ajusta el tamaño según tus necesidades
            />
          </Link>
          <span className="navbar-text me-3 text-white fw-bold">Monitoreo Climático</span>
          <div className="navbar-nav ms-auto">
            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-outline-danger btn-sm"
                style={{
                  background: "transparent",
                  color: "white",
                  borderColor: "transparent",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#004080";
                  e.target.style.color = "lightgray";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "white";
                }}
              >
                Cerrar Sesión
              </button>
            </div>
            <Link href="/">
              <img
                src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-account-circle_89831.png"
                alt="Icono Cuenta"
                className="nav-link"
                style={{ width: "70px", height: "70px" }} // Ajusta el tamaño según tus necesidades
              />
            </Link>
          </div>
        </div>
      </nav>
      <div className="d-flex justify-content-end">
        <Link href="/reportes" passHref>
          <button
            className="btn btn-success"
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
          >
            Volver
          </button>
        </Link>
      </div>
      <div className="d-flex flex-column align-items-center">
        <h1 className="text-white">Historial</h1>
        <div className="mb-3">
          <label htmlFor="filtroFecha" className="mr-2">
          </label>
          <input
            type="date"
            id="filtroFecha"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            max={isToday(new Date()) ? format(new Date(), "yyyy-MM-dd") : ""}
            style={{
              backgroundColor: "#000000", // Cambiar color de fondo del calendario
              color: "#ffffff", // Cambiar color del texto del calendario
            }}
          />
          <button
            className="btn btn-primary ml-2"
            onClick={handleBuscarPorFecha}
            style={{
              backgroundColor: "#000000",
              color: "#F0FFFF",
            }}
          >
            Buscar
          </button>
        </div>
        <div className="row">
          <div className="col-12 table-responsive">
            {Object.keys(reportes).length > 0 ? (
              <table
                className="table table-hover table-bordered table-striped"
                style={{
                  backgroundColor: "#D3D3D3",
                  fontSize: "18px",
                  color: "#000000",
                }}
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
                            <button
                              className="btn"
                              style={{
                                backgroundColor: "#808080",
                                color: "#ffffff", // Letras blancas
                              }}
                            >
                              Ver detalle
                            </button>
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
    </div>
  );
}
