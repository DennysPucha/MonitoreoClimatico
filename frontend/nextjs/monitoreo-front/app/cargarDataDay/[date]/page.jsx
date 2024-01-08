"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { obtener } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Page({ params }) {
    const { date } = params;

    const [reportes, setReportes] = useState([]);
    const [tipoDatoFiltro, setTipoDatoFiltro] = useState("HUMEDAD"); 

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const externalUser = getExternalUser();

            try {
                const response = await obtener(`buscarporFechaYTipoDato/reportes?fecha=${date}&tipo_dato=${tipoDatoFiltro}`);
                setReportes(response.data);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [date, tipoDatoFiltro]);

    const handleTipoDatoChange = (e) => {
        setTipoDatoFiltro(e.target.value);
    };

    return (
        <div className="container">
            <div className="row mt-3">

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
                <div className="col text-center">
                    <div className="bg-primary p-3" style={{ backgroundColor: "#D5D8DC" }}>
                        <h1 className="text-white">Reporte del Dia</h1>
                    </div>

                    <div className="mt-3">
                        {/* Filtro por tipo de dato */}
                        <select value={tipoDatoFiltro} onChange={handleTipoDatoChange} className="form-control mb-3">
                            <option value="TEMPERATURA">Temperatura</option>
                            <option value="HUMEDAD">Humedad</option>
                            <option value="PRESION_ATMOSFERICA">Presión Atmosférica</option>
                        </select>

                        <div
                            className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                            style={{ maxHeight: "300px" }}
                        >
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