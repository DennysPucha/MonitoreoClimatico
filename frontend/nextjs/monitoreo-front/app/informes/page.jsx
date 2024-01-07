'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { format, isAfter, isToday } from "date-fns";
import esLocale from "date-fns/locale/es";
import { obtenerReportesPorFecha } from "@/hooks/obtenerPorFecha";
import css from "styled-jsx/css";
import mensajes from "@/componentes/mensajes";

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
        const response = await obtenerTodo("listar/reportes", token);
        const reportesAgrupados = groupAndSelectMaxTipoDato(response.data);
        setReportes(reportesAgrupados);
        setSinResultados(Object.keys(reportesAgrupados).length === 0);
        if (Object.keys(reportesAgrupados).length === 0) {
          mensajes("No se han encontrado reportes para esa fecha", "error", "Error en busqueda");
        }
        console.log(response);
        console.log("data inform", reportesAgrupados);
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
      const fechaFormateada = reporte.fecha;
      //const fechaFormateada = format(new Date(reporte.fecha), "yyyy-MM-dd", {
      //locale: esLocale,
      //});

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
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-image: url('https://static.vecteezy.com/system/resources/previews/028/663/748/non_2x/ai-ai-generatedrealistic-4k-sky-with-serene-cumulus-clouds-nature-s-atmospheric-beauty-in-stunning-detail-ideal-for-calming-and-scenic-concepts-free-photo.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: 'Arial', sans-serif; /* Cambia la fuente según tus necesidades */
        }
      `}</style>
      <div
        className="container mt-4"
        style={{
          backgroundImage: `url('https://img.freepik.com/fotos-premium/fondo-cielo-azul-nubes-blancas_868292-1936.jpg?w=996')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

      </div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link href="/">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2383/2383684.png"
              alt="Logo"
              className="navbar-brand"
              style={{ width: "70px", height: "70px" }}
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
                style={{ width: "70px", height: "70px" }}
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
              backgroundColor: "#000000",
              color: "#ffffff",
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
        <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded">
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
                      <th>Día</th> {/* Nuevo campo para mostrar el día */}
                      <th>Dato</th>
                      <th>Tipo Dato</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(reportes).map((fechaAgrupada, index) => {
                      const fechaReporte = new Date(fechaAgrupada);
                      const fechaFormateada = format(fechaReporte, "EEEE, yyyy-MM-dd", {
                        locale: esLocale,
                      });
                      const diaSemana = format(fechaReporte, "EEEE", {
                        locale: esLocale,
                      });

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{fechaFormateada}</td>
                          <td>{diaSemana}</td>
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
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

