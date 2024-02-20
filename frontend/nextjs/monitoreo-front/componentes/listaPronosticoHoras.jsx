import React, { useState, useEffect } from "react";
import { obtener } from "@/hooks/Conexion";

const ListadoPronostico = ({ tipoDato, fecha }) => {
    const [pronosticos, setPronosticos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await obtener(`/buscarporFecha/pronosticos/?fecha=${fecha}&tipo_pronostico=${tipoDato}`);
                setPronosticos(response.data);
                console.log("Esta es la respuesta:", response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [fecha, tipoDato]);

    console.log(pronosticos);

    return (
        <div className="container mt-4">
            <div className="table-responsive" style={{ maxHeight: "200px", overflowY: "scroll" }}>
                <table className="table table-bordered table-striped text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Hora</th>
                            <th scope="col">{tipoDato}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pronosticos && pronosticos.length > 0 ? (
                            pronosticos.map((pronostico, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{pronostico.fecha}</td>
                                    <td>{pronostico.hora}</td>
                                    <td>{pronostico.dato}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No se encontraron pronósticos</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListadoPronostico;
