"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import MenuInicio from "@/componentes/menuInicio";
import mensajes from "@/componentes/mensajes";
import { obtenerTodo } from "@/hooks/Conexion";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiClockwork } from "react-icons/gi";

export default function Page() {
  const [reportes, setReportes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const consultarAPI = async (fechaSeleccionada) => {
    try {
      const response = await obtenerTodo(`resumenFecha/reportes?fecha=${fechaSeleccionada}`);
      if (response.code === 200) {
        const { datoMasRecurrenteTemperatura, datoMasRecurrenteHumedad, datoMasRecurrentePresionAtmosferica } = response.data;
        if (datoMasRecurrenteTemperatura === "No hay datos" && datoMasRecurrenteHumedad === "No hay datos" && datoMasRecurrentePresionAtmosferica === "No hay datos") {
          mensajes("No hay reportes registrados en este día", "info", "Advertencia");
          setReportes([]);
        } else {
          setReportes([response.data]);
        }
      } else {
        mensajes(response.msg, "error", "Error al consultar la API");
      }
    } catch (error) {
      console.error(`Error al consultar la API para la fecha ${fechaSeleccionada}:`, error);
      mensajes("Error al consultar la API", "error", "Error al consultar la API");
      setReportes([]);
    }
  };

  useEffect(() => {
    const fechaSeleccionada = format(selectedDate, "yyyy-MM-dd", { locale: esLocale });
    consultarAPI(fechaSeleccionada);
  }, [selectedDate]);

  return (
    <div className="container mt-4">
      <header>
        <MenuInicio />
      </header>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-image: url('https://static.vecteezy.com/system/resources/previews/028/663/748/non_2x/ai-ai-generatedrealistic-4k-sky-with-serene-cumulus-clouds-nature-s-atmospheric-beauty-in-stunning-detail-ideal-for-calming-and-scenic-concepts-free-photo.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: 'Arial', sans-serif;
        }
      `}</style>

      <div className="d-flex flex-column align-items-center">
        <h1 className="text-white"><strong>Historial de Datos</strong></h1>
        <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded d-flex align-items-center">
          <label htmlFor="filtroFecha" className="mr-2" style={{ marginRight: "1em" }}>
            <strong>Selecciona una fecha:</strong>
          </label>
          <div style={{ width: "250px" }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              locale={esLocale}
              maxDate={new Date()}
              className="form-control"
              wrapperClassName="w-100"
              popperClassName="datepicker-popper"
            />
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center mt-4">
          {reportes.map((reporte, index) => (
            <div key={index} className="card m-2" style={{ width: "25rem" }}>
              <div className="card-body">
                <h3 className="card-title">Fecha: {format(selectedDate, "dd/MM/yyyy", { locale: esLocale })}</h3>
                <div className="d-flex align-items-center mb-2">
                  <p className="card-text me-2 mb-0">Temperatura: </p>
                  <p className="card-text mb-0">{reporte?.datoMasRecurrenteTemperatura || "No hay datos"}</p>
                  <FaTemperatureHigh className="me-2" style={{marginLeft:"1em", color:"blue"}}/>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <p className="card-text me-2 mb-0">Humedad: </p>
                  <p className="card-text mb-0">{reporte?.datoMasRecurrenteHumedad || "No hay datos"}</p>
                  <WiHumidity className="me-2" style={{marginLeft:"1em", color:"greenyellow"}}/>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <p className="card-text me-2 mb-0">Presión Atmosférica: </p>
                  <p className="card-text mb-0">{reporte?.datoMasRecurrentePresionAtmosferica || "No hay datos"}</p>
                  <GiClockwork className="me-2" style={{marginLeft:"1em", color:"royalblue"}}/>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  {reporte.fecha && (
                    <Link href={`cargarDataDay/${String(reporte.fecha)}`} passHref>
                      <button className="btn btn-primary">Ver detalle</button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}