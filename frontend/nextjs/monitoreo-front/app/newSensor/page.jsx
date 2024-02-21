"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import React from 'react';
import { getToken, getExternalUser, estaSesion } from "@/hooks/SessionUtil";
import Menu from '@/componentes/menu';
import 'react-datepicker/dist/react-datepicker.css';
import { enviar } from "@/hooks/Conexion";
import mensajes from "@/componentes/mensajes";
export default function Page() {

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Ingrese un nombre para el sensor'),
        ip: Yup.string()
            .required('Ingrese el valor de la ip')
            .matches(
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, //expresion regular mal parqueada xd
                'Ingrese una dirección IP válida'
            ),
        puerto: Yup.number().required('Ingrese el valor del puerto').positive('El puerto debe ser un número positivo').integer('El puerto debe ser un número entero'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;


    const onSubmit = (data) => {
        console.log("entro aqui");
        const externalUsuario = getExternalUser();

        if (!externalUsuario) {
            console.error("No se pudo obtener el external del usuario desde el sessionStorage");
            return;
        }

        const newData = {
            "nombre": data.nombre,
            "ip": data.ip,
            "puerto": data.puerto,
            "persona": externalUsuario,
        };

        console.log(newData);
        const token = getToken();

        enviar('/guardar/sensor', newData, token).then((info) => {
            console.log(info);
            if (!estaSesion()) {
                mensajes("Error en inicio de sesion", info.msg, "error");
            } else {
                console.log(info);
                mensajes("Buen trabajo!", "success", "REGISTRADO CON ÉXITO");
                router.push('/sensores');
            }
        });
    };

    return (
        <div>

            <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <div className="card" style={{ width: '500px', padding: '15px', borderRadius: '10px', backgroundColor: '#f8f8ff' }}>
                    <h2 className="text-center mb-4">Registrar Sensor</h2>
                    <form className="user" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-outline mb-4">
                            <label className="form-label">Alias para el sensor</label>
                            <input {...register('nombre')} name="nombre" id="nombre" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} />
                            <div className='alert alert-danger invalid-feedback'>{errors.nombre?.message}</div>
                        </div>

                        <div className="form-outline align-content-center" style={{ display: "flex" }}>
                            <div className="form-outline mb-4" style={{ marginRight: "2em" }}>
                                <label className="form-label">IP del Sensor</label>
                                <input {...register('ip')} name="ip" id="ip" className={`form-control ${errors.ip ? 'is-invalid' : ''}`} />
                                <div className='alert alert-danger invalid-feedback'>{errors.ip?.message}</div>
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label">Puerto del Sensor</label>
                                <div className="input-group ">
                                    <input {...register('puerto')} type='number' name="puerto" id="puerto" className={`form-control ${errors.puerto ? 'is-invalid' : ''}`} min={0} placeholder='80' />
                                </div>
                                <div className='alert alert-danger invalid-feedback'>{errors.puerto?.message}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <a href="/sensores" className="btn btn-danger btn-rounded me-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                </svg>

                                <span className="ms-1">Cancelar</span>
                            </a>
                            <input className="btn btn-success btn-rounded" type='submit' value='Registrar'></input>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}