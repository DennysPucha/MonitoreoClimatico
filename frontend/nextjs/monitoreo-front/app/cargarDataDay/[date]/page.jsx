"use client";
import { useEffect, useState } from "react";
import MenuInicio from "@/componentes/menuInicio";
import { obtener } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { Modal } from 'react-bootstrap';
import { FcAbout } from "react-icons/fc";
import { CiSun } from "react-icons/ci";
import { GiSunCloud } from "react-icons/gi";
import { RiRainyFill } from "react-icons/ri";
import { FaSunPlantWilt } from "react-icons/fa6";
import { RiTempColdFill } from "react-icons/ri";
import { IoPartlySunnySharp } from "react-icons/io5";
import { PiCloudSunBold } from "react-icons/pi";
export default function Page({ params }) {
    const { date } = params;

    const [reportes, setReportes] = useState([]);
    const [tipoDatoFiltro, setTipoDatoFiltro] = useState("NINGUNO");
    const [clima, setClima] = useState("");
    const [descripcionClima, setDescripcionClima] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();
            const externalUser = getExternalUser();

            try {
                const response = await obtener(`buscarporFecha/determinarClima?fecha=${date}`);
                setClima(response.data.clima);
                setDescripcionClima(response.data.descripcion);

                // Aquí actualizamos los reportes con el nuevo tipoDatoFiltro
                const response2 = await obtener(`buscarporFechaYTipoDato/reportes?fecha=${date}&tipo_dato=${tipoDatoFiltro}`);
                setReportes(response2.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [date, tipoDatoFiltro]);

    const handleTipoDatoChange = (e) => {
        setTipoDatoFiltro(e.target.value);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <div className="container">
            <header>
                <MenuInicio></MenuInicio>
            </header>
            <div className="row mt-3">
                <div className="col text-center">
                    <div className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded" >
                        <h1 className="text-white">
                            Reportes del sensor
                            <button
                                className="btn btn-info ms-3"
                                style={{ width: "30px", height: "30px", padding: 0, border: "none", background: "none" }}
                                onClick={() => setShowModal(true)}
                            >
                                <FcAbout style={{ width: "30px", height: "30px" }} />
                            </button>
                        </h1>

                    </div>


                    <div className="mt-3 d-flex align-items-center">
                        <label htmlFor="tipoDatoFiltro" className="me-2">Seleccione una opción para filtrar la data:</label>
                        <select id="tipoDatoFiltro" value={tipoDatoFiltro} onChange={handleTipoDatoChange} className="form-control mb-3">
                            <option value="NINGUNO">Ninguno</option>
                            <option value="TEMPERATURA">Temperatura</option>
                            <option value="HUMEDAD">Humedad</option>
                            <option value="PRESION_ATMOSFERICA">Presión Atmosférica</option>
                        </select>
                    </div>

                    <div
                        className="overflow-auto border p-3 rounded"
                        style={{ maxHeight: "15em" }}
                    >
                        {Array.isArray(reportes) && reportes.length > 0 ? (
                            <div>
                                <table className="table table-hover rounded">
                                    <thead>
                                        <tr>
                                            <th>Nro</th>
                                            <th>Hora Registro</th>
                                            <th>Dato</th>
                                            <th className="table-info">Tipo Dato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportes.map((reporte, index) => (
                                            <tr key={index} >
                                                <td>{index + 1}</td>
                                                <td>{reporte.hora_registro}</td>
                                                <td>{reporte.dato}</td>
                                                <td className="table-info">{reporte.tipo_dato}</td>
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

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark" style={{marginRight:"2em"}}>Información del Clima</Modal.Title>
                    {clima && (
                        <div>
                            {clima === "Caluroso y húmedo" && (
                                <FaSunPlantWilt style={{ width: "50px", height: "50px" ,color: 'yellow'}} />
                            )}
                            {clima === "Frío y baja presión" && (
                                <GiSunCloud style={{ width: "50px", height: "50px" ,color: 'grey'}} />
                            )}
                            {clima === "Caluroso" && (
                                 <CiSun style={{ width: "50px", height: "50px" ,color: 'yellow'}} />
                            )}
                            {clima === "Frío y alta presión" && (
                                <RiTempColdFill style={{ width: "50px", height: "50px" ,color: 'blue'}} />
                            )}
                            {clima === "Húmedo" && (
                                <RiRainyFill style={{ width: "50px", height: "50px" ,color: 'grey'}} />
                            )}
                            {clima === "Normal con baja presión" && (
                                <IoPartlySunnySharp style={{ width: "50px", height: "50px" ,color: 'blue'}} />
                            )}
                            {clima === "Normal" && (
                                <PiCloudSunBold style={{ width: "50px", height: "50px" ,color: 'blue'}} />
                            )}
                        </div>
                    )}
                </Modal.Header>
                <Modal.Body className="text-dark">
                    <p>Tipo de clima: {clima}</p>
                    
                    <p>{descripcionClima}</p>
                </Modal.Body>
            </Modal>
        </div>
    );
}