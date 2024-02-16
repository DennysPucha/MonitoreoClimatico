"use client";
import React, { useState } from "react";
import TarjetasPronosticos from "@/componentes/tarjetasPronostico";
import ListadoPronostico from "@/componentes/listaPronosticoHoras";

export default function Page() {
    const [selectedTipoDato, setSelectedTipoDato] = useState("");
    const [selectedFecha, setSelectedFecha] = useState("");
    const [mostrarListado, setMostrarListado] = useState(false);

    const tiposDatos = ["HUMEDAD", "TEMPERATURA", "PRESION_ATMOSFERICA"];

    const getProximasFechas = () => {
        const hoy = new Date();
        const fechas = Array.from({ length: 7 }, (_, i) => {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            // Obtener partes de la fecha
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, '0');
            const day = String(fecha.getDate()).padStart(2, '0');

            // Formatear la fecha en 'YYYY-MM-DD'
            return `${year}-${month}-${day}`;
        });
        return fechas;
    };

    const fechas = getProximasFechas();
    console.log(fechas);

    const handleButtonClick = () => {
        setMostrarListado(true);
    };

    return (
        <div className="text-center">
            <TarjetasPronosticos />
            <h2 className="mt-4">Pronóstico por hora</h2>
            <div className="d-flex justify-content-center mt-4">
                <div className="me-2">
                    <label htmlFor="tipoDato" className="form-label">Tipo de Dato:</label>
                    <select
                        className="form-select"
                        id="tipoDato"
                        value={selectedTipoDato}
                        onChange={(e) => setSelectedTipoDato(e.target.value)}
                    >
                        <option value="">Seleccione un tipo de dato</option>
                        {tiposDatos.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="ms-2">
                    <label htmlFor="fecha" className="form-label">Fecha:</label>
                    <select
                        className="form-select"
                        id="fecha"
                        value={selectedFecha}
                        onChange={(e) => setSelectedFecha(e.target.value)}
                    >
                        <option value="">Seleccione una fecha</option>
                        {fechas.map((fecha) => (
                            <option key={fecha} value={fecha}>{fecha}</option>
                        ))}
                    </select>
                </div>

            </div>
            <p></p>
            <button className="btn btn-primary btn-sm ms-2" onClick={handleButtonClick}>
                Ver Pronóstico
            </button>
            {/* Mostrar ListadoPronostico si el estado es true */}
            {mostrarListado && <ListadoPronostico tipoDato={selectedTipoDato} fecha={selectedFecha} />}
        </div>
    );
}
