"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";

export default function Page() {
  const [sensores, setsensores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const externalUser = getExternalUser();

      try {
        const response = await obtenerTodo("listar/sensores", token);
        setsensores(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="col">
        {/* Menú Superior */}
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
      </div>
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="row mt-3">
          <div className="col text-center">
            <div className="bg-primary p-3">
              <h1 className="text-white">Nodos Sensores</h1>
            </div>
            <div className="mt-3">
              <div
                className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                style={{ maxHeight: "300px" }} // Ajusta la altura según tus necesidades
              >
                {Array.isArray(sensores) && sensores.length > 0 ? (
                  <div>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nro</th>
                          <th>Nombre</th>
                          <th>Ip</th>
                          <th>Estado</th>
                          <th>Datos</th>
                          <th>Editar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sensores.map((sensor, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sensor.nombre}</td>
                            <td>{sensor.ip}</td>
                            <td>{sensor.estado ? "Activo" : "No activo"}</td>
                            <td>
                              {sensor.external_id && (
                                <Link href={`viewDataSensor/${sensor.external_id}`} passHref>
                                  <button className="btn btn-primary">Ver datos</button>
                                </Link>
                              )}
                            </td>
                            <td>
                              {sensor.external_id && (
                                <Link href={`editsensor/${sensor.external_id}`} passHref>
                                  <button className="btn btn-primary">Editar</button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No se encontraron sensores.</p>
                )}
              </div>
            </div>
            <div className="mt-3">

              <Link href="/newSensor" passHref>
                <button className="btn btn-success me-2">Añadir Sensor</button>
              </Link>
              <Link href="/changeSensor" passHref>
                <button className="btn btn-warning">Desactivar Sensor</button>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}