export default function Menu() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                {/* Imagen al inicio del menú */}
                <a className="navbar-brand" href="../inicioSesion">
                    <img src="https://cdn-icons-png.flaticon.com/512/2383/2383684.png" alt="Inicio" height="30" />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="../inicioSesion">Cerrar sesion</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../modificarAuto">Modificar</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="../agregar">Añadir</a>
                        </li>
                    </ul>
                </div>

                {/* Imagen al final del menú */}
                <a className="navbar-brand" href="/ruta/de/tu/imagen-fin.png">
                    <img src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-account-circle_89831.png" alt="Fin" height="30" />
                </a>
            </div>
        </nav>
    );
}
