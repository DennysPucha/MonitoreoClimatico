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
      <Link href="/informes" passHref>
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

      <h1 className="text-white" style={{ fontFamily: 'Tahoma, sans-serif', fontWeight: 'bold' }}>Reporte del día</h1>

      {promedioHumedad !== null && (
        <div className="text-black" style={{ fontFamily: 'Tahoma, sans-serif', ontWeight: 'bold' }}>
          <p>Promedio del día : {promedioHumedad}%</p>
        </div>
      )}
      <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded">

      {reportes.length > 0 ? (
        <table
          className="table table-hover table-bordered table-striped"
          style={{
            backgroundColor: "#D3D3D3", // Cambiar el color de fondo a #D3D3D3
            fontSize: "18px",
            color: "#000000", // Cambiar el color del texto a negro
          }}
        >
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
    </div>
  );
}
