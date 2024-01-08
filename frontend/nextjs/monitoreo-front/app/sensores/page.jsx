"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { enviar, obtenerTodo } from "@/hooks/Conexion";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import mensajes from "@/componentes/mensajes";
import swal from "sweetalert";

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

  const desactivarSensor = async (externalId, estado) => {
    const confirmMessage = estado
      ? "¿Deseas desactivar el sensor?"
      : "¿Deseas activar el sensor?";

    const successMessage = estado
      ? "Sensor desactivado con éxito"
      : "Sensor activado con éxito";

    const errorMessage = estado
      ? "Algo salió mal al desactivar el sensor"
      : "Algo salió mal al activar el sensor";

    swal({
      title: confirmMessage,
      text: estado
        ? "Una vez desactivado, el sensor no podrá recopilar datos"
        : "Una vez activado, el sensor comenzará a recopilar datos",
      icon: "warning",
      buttons: ["Cancelar", estado ? "Desactivar" : "Activar"],
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        try {
          const response = await enviar(`/cambiar/estado/sensor/${externalId}`);
          console.log(response);

          if (response.code === 200) {
            mensajes(successMessage, "success", "Realizado con éxito");
            // Actualizar el estado del sensor sin recargar la página
            setsensores((prevSensores) =>
              prevSensores.map((sensor) =>
                sensor.external_id === externalId
                  ? { ...sensor, estado: !estado }
                  : sensor
              )
            );
          } else {
            mensajes(errorMessage, "error", "ERROR");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      }
    });
  };

  return (
    <div className="container">
      {/* ... (Código del navbar y otros elementos) ... */}
      <div className="container mt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="row mt-3">
          <div className="col text-center">
            <div className="bg-primary p-3">
              <h1 className="text-white">Nodos Sensores</h1>
            </div>
            <div className="mt-3">
              <div
                className="overflow-auto border p-3 bg-black bg-opacity-10 text-white rounded"
                style={{ maxHeight: "300px" }}
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
                          <th>Desactivar</th>
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
                                <Link href={`editSensor/${sensor.external_id}`} passHref>
                                  <button className="btn btn-primary">Editar</button>
                                </Link>
                              )}
                            </td>
                            <td>
                              {sensor.external_id && (
                                <button
                                  className={`btn ${
                                    sensor.estado ? "btn-warning" : "btn-success"
                                  }`}
                                  onClick={() =>
                                    desactivarSensor(
                                      sensor.external_id,
                                      sensor.estado
                                    )
                                  }
                                >
                                  {sensor.estado
                                    ? "Desactivar Sensor"
                                    : "Activar Sensor"}
                                </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}