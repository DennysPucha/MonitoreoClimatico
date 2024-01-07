import { getToken } from "./SessionUtil";

export async function obtenerReportesPorFecha(fecha) {
  const token = getToken();

  try {
    const url = `http://localhost:3000/monitoreo/buscarporFecha/reporte?fecha=${fecha}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Asegúrate de incluir el token de autorización si es necesario
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud GET: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error('Error en la solicitud GET:', error);
    throw error;
  }
}
