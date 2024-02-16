'use client'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import mensajes from "@/componentes/mensajes";
import { useRouter } from "next/navigation";
import { inicioSesion } from "@/hooks/inicio_sesion";
import { borrarSesion, getRol } from "@/hooks/SessionUtil";

export default function InicioSesion() {
    borrarSesion();
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        identificador: Yup.string().required('Ingrese su identificador como usuario'),
        clave: Yup.string().required("Ingrese su clave"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const sendData = (data) => {
        const requestData = { correo: data.identificador, clave: data.clave };
        inicioSesion(requestData).then((info) => {
            if (info.code === 200) {
                mensajes("Inicio Exitoso", "success", "Bienvenido");
                router.push("/sensores");

            } else {
                mensajes("Error de Inicio, clave o correo incorrecta", "error", "Error");
            }
        });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh', display: 'flex' }}>
            <div className="card" style={{ width: '500px', padding: '15px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', color: 'black' }}>
                    Inicio de Sesión
                </h1>

                <div className="card-body py-5 px-md-5">
                    <form onSubmit={handleSubmit(sendData)}>
                        <div className="form-outline mb-4">
                            <input
                                {...register("identificador")}
                                type="text"
                                name="identificador"
                                id="identificador"
                                className={`form-control ${errors.identificador ? "is-invalid" : ""}`}
                                style={{ width: '370px', padding: '7px', borderRadius: '5px', backgroundColor: 'rgba(51, 185, 251, 0.1)', textAlign: 'center', margin: '0 auto', color: '#007BFF' }}
                            />
                            <label className="form-label" style={{ fontFamily: 'Arial, sans-serif', color: 'black' }}>Identificador de usuario</label>
                            <div className="alert alert-danger invalid-feedback">
                                {errors.identificador?.message}
                            </div>
                        </div>

                        <div className="form-outline mb-4">
                            <input
                                {...register("clave")}
                                type="password"
                                name="clave"
                                id="clave"
                                className={`form-control ${errors.clave ? "is-invalid" : ""}`}
                                style={{ width: '370px', padding: '7px', borderRadius: '5px', backgroundColor: 'rgba(51, 185, 251, 0.1)', textAlign: 'center', margin: '0 auto', color: 'red' }}
                            />
                            <label className="form-label" style={{ fontFamily: 'Roboto, sans-serif', color: 'black' }}>Clave</label>
                            <div className="alert alert-danger invalid-feedback">
                                {errors.clave?.message}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block mb-4"
                            style={{ backgroundColor: '#007BFF', border: 'none' }}
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
