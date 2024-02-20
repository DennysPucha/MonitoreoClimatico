import requests
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import joblib  # Para guardar y cargar modelos entrenados


def eliminar_datos():
    url = "http://localhost:3000/monitoreo/eliminar/pronostico"
    response = requests.delete(url)

    if response.status_code == 200:
        print("Datos eliminados correctamente")
    else:
        print(
            "Error al hacer la solicitud DELETE:", response.status_code, response.text
        )


def obtener_datos():
    url = "http://localhost:3000/monitoreo/listar/reportes"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        eliminar_datos()  # Eliminar los datos de pronóstico anteriores
        return pd.DataFrame(data["data"])

    else:
        print("Error al hacer la solicitud GET:", response.status_code, response.text)
        return None


def entrenar_modelo(datos, tipo_dato):
    data_tipo = datos[datos["tipo_dato"] == tipo_dato]
    data_tipo["fecha_hora"] = pd.to_datetime(
        data_tipo["fecha"] + " " + data_tipo["hora_registro"]
    )

    model = LinearRegression()
    data_tipo["fecha_numerica"] = data_tipo["fecha_hora"].astype("int64") // 10**9
    model.fit(
        data_tipo[["fecha_numerica"]],
        data_tipo["dato"].astype(float),
    )

    # Guardar el modelo entrenado
    joblib.dump(model, f"modelo_entrenado_{tipo_dato.lower()}.pkl")

    return model, data_tipo["fecha_hora"].max()


def predecir(modelo, ultima_fecha, tipo_dato):
    # Incluir las horas restantes del día actual y predecir para las próximas 24 horas de cada día durante los próximos 6 días
    predicciones_futuras = pd.to_datetime(
        pd.date_range(start=ultima_fecha, periods=7 * 24 + 1, freq="H")
    )
    predicciones_futuras_numericas = predicciones_futuras.astype("int64") // 10**9
    predicciones = modelo.predict(predicciones_futuras_numericas.values.reshape(-1, 1))

    predicciones_futuras = pd.to_datetime(predicciones_futuras_numericas, unit="s")

    # Imprimir todas las predicciones para cada hora
    print(f"\nPredicciones para {tipo_dato} para los próximos 6 días:\n")

    for fecha, prediccion in zip(predicciones_futuras, predicciones):
        fecha_str = fecha.strftime("%Y-%m-%d")
        hora_str = fecha.strftime("%H:%M")
        print(f"{fecha_str}: Predicción de {tipo_dato}: {prediccion}")

        # Guardar en la base de datos
        guardar_bd(
            fecha_str,
            hora_str,
            str(prediccion),  # Convertir a cadena antes de enviar
            tipo_dato,
        )


def guardar_bd(fecha, hora, dato, tipo_dato):
    url = "http://localhost:3000/monitoreo/guardar/pronostico"
    print(f"Guardando en la base de datos: {fecha} {hora} {dato} {tipo_dato}")
    payload = {
        "fecha": fecha,
        "hora": hora,
        "dato": dato,
        "tipo_pronostico": tipo_dato,
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print("Reporte guardado en la base de datos")
    else:
        print("Error al hacer la solicitud POST:", response.status_code, response.text)


if __name__ == "__main__":
    datos = obtener_datos()

    if datos is not None:
        tipos_datos = datos["tipo_dato"].unique()

        for tipo_dato in tipos_datos:
            model, ultima_fecha = entrenar_modelo(datos, tipo_dato)
            predecir(model, ultima_fecha, tipo_dato)
