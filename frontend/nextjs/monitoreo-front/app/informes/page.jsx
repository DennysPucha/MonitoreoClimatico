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
        setReportes([data.data]);
      } catch (error) {
        console.error(`Error al consultar la API para la fecha ${fechaSeleccionada}:`, error);
        setReportes([]);
      }
    };

    consultarAPI();
  }, [selectedDate]);

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
        
      <div className="d-flex flex-column align-items-center">
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
          <Link href="/informes" passHref>
                    <button
                        className="btn btn-success"
                        style={{
                            backgroundColor: "#D6DBDF", 
                            color: "#004080", 
                            borderColor: "#D6DBDF", 
                        }}
                    >
                        Volver
                    </button>
                </Link>
        </nav>
        <h1 className="text-white">Historial</h1>

        <div className="mb-3">
  <label htmlFor="filtroFecha" className="mr-2">
    Selecciona una fecha:
  </label>
  <DatePicker
    selected={selectedDate}
    onChange={(date) => setSelectedDate(date)}
    dateFormat="dd/MM/yyyy"
    locale="es"
    maxDate={new Date()} 
  />
</div>
  

        <button
          className="btn btn-primary"
          onClick={() => consultarAPI()}
          style={{
            backgroundColor: "transparent", 
            color: "#F0FFFF",
            border: "none", 
          }}
        >
          Buscar en la fecha
        </button>
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
                        <button
                          className="btn btn-primary"
                          style={{
                            backgroundColor: "#D6DBDF", 
                            color: "#004080", 
                            border: "none", 
                          }}
                        >
                          ver detalle
                        </button>
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