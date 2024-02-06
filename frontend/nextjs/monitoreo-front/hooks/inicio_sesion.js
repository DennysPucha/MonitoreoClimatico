import mensajes from "@/componentes/mensajes";
import { enviar } from "./Conexion";
import { save } from "./SessionUtil";

export async function inicioSesion(data) {
    try {
        const sesion = await enviar("iniciar_sesion", data);
        if (sesion.code === 200 && sesion.code) {
            console.log(sesion);
            save("user", sesion.data.usuario);
            save("token", sesion.data.token);
            save("rol", sesion.data.rol);
            save("external_id", sesion.data.external_id);
        }

        return sesion;
    } catch (error) {
        mensajes("Error", "Error al iniciar sesion, usuario o contraseña incorrectos", "success");
        throw error;
    }
}
