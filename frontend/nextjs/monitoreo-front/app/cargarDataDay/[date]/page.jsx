"use client";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import Link from "next/link";
import { obtener } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
=======
import Menu from "@/componentes/menu";
import { obtener } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import Link from "next/link";

>>>>>>> origin/Pronostico

export default function Page({ params }) {
    const { date } = params;

    const [reportes, setReportes] = useState([]);
    const [tipoDatoFiltro, setTipoDatoFiltro] = useState("HUMEDAD"); // Tipo de dato por defecto

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
<<<<<<< HEAD
            <div className="row mt-3">
                <Link href="/informes" passHref>
                    <button className="btn btn-success">Volver</button>
                </Link>
                <div className="col text-center">
                    <div className="bg-primary p-3">
=======
            <header>
                <Menu></Menu>
            </header>
            <div className="row mt-3">
                {/* <Link href="/informes" passHref>
                    <button className="btn btn-success">Volver</button>
                </Link> */}
                <div className="col text-center">
                    <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded" >
>>>>>>> origin/Pronostico
                        <h1 className="text-white">Reportes del sensor</h1>
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