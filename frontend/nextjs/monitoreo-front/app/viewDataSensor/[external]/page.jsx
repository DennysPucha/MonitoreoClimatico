"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import Menu from "@/componentes/menu";

export default function Page({ params }) {
    const { external } = params;
    const [reportes, setreportes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const externalUser = getExternalUser();

            try {
                const response = await obtenerTodo(`obtener/sensorReportes/${external}`, token);
                setreportes(response.data.reporte);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="row mt-3">
                <div className="col text-center border p-3  text-white rounded">
                    <div className="bg-primary p-3 rounded">
                        <h1 className="text-white">Últimos Reportes del sensor</h1>
                    </div>
                    <div className="mt-3">
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
            {/* Agregar el botón al final de la página sin elemento <a> */}
            <div className="text-center mt-3">
                <Link href="/otraPagina">
                    <button className="btn btn-primary">Volver</button>
                </Link>
            </div>
        </div>
    );
}

